﻿using Elmah.Io.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Access.AdditionalModels;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Payment;
using Naspinski.FoodTruck.Data.Distribution.Handlers.System;
using Naspinski.FoodTruck.Data.Distribution.Models.System;
using Naspinski.FoodTruck.WebApp.Helpers;
using Naspinski.FoodTruck.WebApp.Models;
using Naspinski.Messaging.Email;
using Square.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : BaseController
    {
        private readonly OrderHandler _handler;
        private readonly SettingHandler _settingHandler;
        private readonly AzureSettings _azureSettings;
        private SystemModel _settings;
        private readonly IEnumerable<SquareLocationModel> _squareLocations;

        private Data.Models.Payment.Order _order;

        public PaymentController(FoodTruckContext context, AzureSettings azureSettings) : base(context)
        {
            _handler = new OrderHandler(context, "system");
            _azureSettings = azureSettings;
            _settingHandler = new SettingHandler(context);
            _squareLocations = new SquareLocationHandler(context, "system").GetAll();

            _settings = new SystemModel(_settingHandler.Get(new[] {
                SettingName.TwilioAuthToken,
                SettingName.TwilioPhoneNumber,
                SettingName.TwilioSid
            }));
        }

        private SquareLocationModel GetSquareLocation(string locationId)
        {
            return _squareLocations.FirstOrDefault(x => x.LocationId.Equals(locationId, StringComparison.InvariantCultureIgnoreCase));
        }

        private async Task<CreateOrderRequest> GetOrderRequest(PaymentModel model, bool saveOrder)
        {
            var square = new SquareHelper(GetSquareLocation(model.LocationId));
            var taxes = await square.GetTaxes();
            taxes = taxes ?? new List<CatalogObject>();
            var tax = await square.GetAdditiveTaxPercentage(taxes);
            _order = _handler.Submit(model.OrderType, model, tax, square.UseProduction, deferSave: !saveOrder);
            return square.GetCreateOrderRequest(model, _order, Guid.NewGuid(), taxes);
        }

        [HttpPost]
        [Route("amount")]
        public async Task<long> GetAmount(PaymentModel model)
        {
            try
            {
                var square = new SquareHelper(GetSquareLocation(model.LocationId));
                var orderRequest = await GetOrderRequest(model, false);
                var squareOrder = await square.Client.OrdersApi.CreateOrderAsync(orderRequest);
                return squareOrder.Order.TotalMoney.Amount ?? 0;
            }
            catch(Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> Pay(PaymentModel model)
        {
            var system = new SystemModel(_settingHandler.GetAll());
            var settings = new SettingsModel(_squareLocations, system, _context);
            try
            {
                if(!settings.IsOrderingOn)
                    throw new Exception("Online ordering is temporarily disabled");
                if (settings.IsBrickAndMortar && !settings.IsValidTimeForOnlineOrder)
                    throw new Exception("Too late for online order");

                if (!string.Equals(system.Settings[SettingName.IsOrderingOn], true.ToString(), StringComparison.OrdinalIgnoreCase))
                    throw new InvalidOperationException("Online ordering is currently unavailable");

                var square = new SquareHelper(GetSquareLocation(model.LocationId));
                var isBrickAndMortar = string.Equals(system.Settings[SettingName.BrickAndMortarMode], true.ToString(), StringComparison.OrdinalIgnoreCase);
                var orderRequest = await GetOrderRequest(model, true);
                var squareOrder = await square.Client.OrdersApi.CreateOrderAsync(orderRequest);
                
                var note = $"ONLINE ORDER - ID: {_order.Id}";

                if (squareOrder.Order.TotalMoney.Amount == 0)
                    _handler.TransactionApproved(_order.Id, string.Empty, "NO_PAYMENT");
                else
                {
                    var paymentRequest = new CreatePaymentRequest(
                        amountMoney: squareOrder.Order.TotalMoney,
                        idempotencyKey: Guid.NewGuid().ToString(),
                        sourceId: model.Nonce,
                        verificationToken: model.BuyerVerificationToken,
                        buyerEmailAddress: model.Email,
                        orderId: squareOrder.Order.Id,
                        note: note);

                    var paymentResponse = await square.Client.PaymentsApi.CreatePaymentAsync(paymentRequest);
                    try
                    {
                        _order = _handler.TransactionApproved(_order.Id, paymentResponse.Payment.Id, paymentResponse.Payment.OrderId);
                        _order.SetFullText();
                    }
                    catch(Exception ex) // order and payment went through, there was a DB error
                    {
                        ex.Ship(this.HttpContext);
                        throw;
                    }
                }

                DoNotification(_order, system, settings.IsTextOn, model.Name);
                return Ok();
            }
            catch (Exception ex)
            {
                Log(ex);
                return new BadRequestObjectResult(ex.Message);
            }
        }

        private void DoNotification(Data.Models.Payment.Order order, SystemModel settings, bool sendText, string name = "")
        {
            try
            {
                Parallel.Invoke(
                    () => ConfirmationEmail(order, settings, name),
                    () => { if (sendText) ConfirmationText(order, settings, name); },
                    () => ConfirmationEmail(order, settings, name, false),
                    () => { if (sendText) ConfirmationText(order, settings, name, false); }
                );
            }
            catch (AggregateException agg)
            {
                if (agg.InnerExceptions.Any())
                    throw new Exception(string.Join(", ", agg.InnerExceptions.Select(ex => ex.Message)));

                throw new Exception("An unknown error has occured, plase call to see if your order was placed");
            }
        }

        private void ConfirmationEmail(Data.Models.Payment.Order order, SystemModel settings, string name, bool isCustomer = true)
        {
            try
            {
                var subject = $"{settings.Get(SettingName.Title)} - Order Confirmation {order.Id}";
                if (isCustomer)
                    EmailSender.Send(_azureSettings.SendgridApiKey, subject, GetBody(order, name, settings, true), order.Email, settings.Get(SettingName.ContactEmail));
                else
                {
                    var emailsString = settings.Get(SettingName.OrderNotificationEmails);
                    if (!string.IsNullOrWhiteSpace(emailsString))
                    {
                        var emails = emailsString.Split(new[] { ',', ' ', ';' }, StringSplitOptions.RemoveEmptyEntries).Where(x => x.Length > 5 && x.Contains("@"));
                        foreach (var email in emails)
                        {
                            try { EmailSender.Send(_azureSettings.SendgridApiKey, subject, GetBody(order, name, settings, false), email, settings.Get(SettingName.ContactEmail)); }
                            catch (Exception ex) { Log(ex); }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log(ex);
                if (isCustomer)
                    throw new Exception("Order placed successfully but there was an error sending confirmation email - don't worry, your food will be ready!");
            }
        }

        private void ConfirmationText(Data.Models.Payment.Order order, SystemModel settings, string name, bool isCustomer = true)
        {
            try
            {
                if (isCustomer && !string.IsNullOrWhiteSpace(order.Phone))
                    SmsHelper.Send(GetBody(order, name, settings, true), order.Phone, _settings);

                if (!isCustomer)
                {
                    var phoneNumbersString = settings.Get(SettingName.OrderNotificationPhoneNumbers);
                    if (!string.IsNullOrWhiteSpace(phoneNumbersString))
                    {
                        var phoneNumbers = phoneNumbersString.Split(new[] { ',', ' ', ';' }, StringSplitOptions.RemoveEmptyEntries).Where(x => x.Length == 10 && x.All(c => char.IsDigit(c)));
                        foreach (var phoneNumber in phoneNumbers)
                        {
                            try
                            {
                                SmsHelper.Send(GetBody(order, name, settings, false), phoneNumber, _settings);
                            }
                            catch (Exception ex)
                            {
                                Log(ex);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Log(ex);
                if (isCustomer)
                    throw new Exception("Order placed successfully but there was an error sending confirmation text - don't worry, your food will be ready!");
            }
        }

        private string GetBody(Data.Models.Payment.Order order, string name, SystemModel settings, bool isCustomer)
        {
            var n = Environment.NewLine;
            var title = settings.Get(SettingName.Title);
            var customerInfo = string.Join(", ", new[] { name, order.Email, order.Phone }.Where(x => !string.IsNullOrWhiteSpace(x)));
            return isCustomer
                ? $"{title} Order Confirmation:{n}{n}{order.FullText}{n}{n}Thank you!{n}-{title}"
                : $"Order for {customerInfo}{n}{n}{order.FullText}";
        }
    }
}