using Elmah.Io.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Access.AdditionalModels;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Menu;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Payment;
using Naspinski.FoodTruck.WebApp.Helpers;
using Naspinski.FoodTruck.WebApp.Models;
using Naspinski.Messaging.Email;
using Naspinski.Messaging.Sms;
using Naspinski.Messaging.Sms.Twilio;
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
        private const string OrderPrefix = "I-";
        private readonly OrderHandler _handler;
        private readonly SettingHandler _settingHandler;
        private readonly AzureSettings _azureSettings;
        private SquareHelper _square;
        private SquareSettings _squareSettings;

        private Data.Models.Payment.Order _order;

        public PaymentController(FoodTruckContext context, SquareSettings squareSettings, AzureSettings azureSettings) : base(context)
        {
            _handler = new OrderHandler(context, "system");
            _azureSettings = azureSettings;
            _settingHandler = new SettingHandler(_context);
            _squareSettings = squareSettings;
            _square = new SquareHelper(squareSettings);
        }

        [HttpGet]
        [Route("tax")]
        public async Task<decimal> GetTaxPercentage()
        {
            var settings = new SystemModel(new SettingHandler(this._context).Get(new[] { SettingName.SquareOnlineTaxId }));
            return await _square.GetAdditiveTaxPercentage();
        }

        private async Task<CreateOrderRequest> GetOrderRequest(PaymentModel model, bool saveOrder)
        {
            var taxes = await _square.GetTaxes();
            taxes = taxes ?? new List<CatalogObject>();
            var tax = await _square.GetAdditiveTaxPercentage(taxes);
            _order = _handler.Submit(model.OrderType, model, tax, _square.UseProduction, deferSave: !saveOrder);
            return await _square.GetCreateOrderRequest(model, _order, Guid.NewGuid(), taxes);
        }

        [HttpPost]
        [Route("amount")]
        public async Task<long> GetAmount(PaymentModel model)
        {
            var orderRequest = await GetOrderRequest(model, true);
            return _square.GetTotalInCents(orderRequest);
        }

        [HttpPost]
        [Route("")]
        public async Task<IActionResult> Pay(PaymentModel model)
        {
            var system = new SystemModel(_settingHandler.GetAll());
            var settings = new SettingsModel(_azureSettings, _squareSettings, system, _context);
            try
            {
                if (!settings.IsValidTimeForOnlineOrder)
                    throw new Exception("Too late for online order");

                if (!string.Equals(system.Settings[SettingName.IsOrderingOn], true.ToString(), StringComparison.OrdinalIgnoreCase))
                    throw new InvalidOperationException("Online ordering is currently unavailable");

                var isBrickAndMortar = string.Equals(system.Settings[SettingName.BrickAndMortarMode], true.ToString(), StringComparison.OrdinalIgnoreCase);
                var orderRequest = await GetOrderRequest(model, true);
                var squareOrder = await _square.Client.OrdersApi.CreateOrderAsync(_square.LocationId, orderRequest);
                
                var note = $"{OrderPrefix}{_order.Id} - ONLINE ORDER";
                var amount = new Money(_square.GetTotalInCents(orderRequest), "USD");

                if (amount.Amount == 0)
                {
                    _handler.TransactionApproved(_order.Id, "NO_PAYMENT");
                }
                else
                {
                    var paymentRequest = new CreatePaymentRequest(
                        amountMoney: amount,
                        idempotencyKey: Guid.NewGuid().ToString(),
                        sourceId: model.Nonce,
                        verificationToken: model.BuyerVerificationToken,
                        buyerEmailAddress: model.Email,
                        orderId: squareOrder.Order.Id,
                        note: note);

                    var paymentResponse = await _square.Client.PaymentsApi.CreatePaymentAsync(paymentRequest);
                    try
                    {
                        _handler.TransactionApproved(_order.Id, paymentResponse.Payment.Id);
                    }
                    catch(Exception ex) // order and payment went through, there was a DB error
                    {
                        ex.Ship(this.HttpContext);
                    }
                }

                DoNotification(_order, system, model.Name);
                return Ok();
            }
            catch (Exception ex)
            {
                Log(ex); 
                return BadRequest(ex.Message);
            }
        }

        private void DoNotification(Data.Models.Payment.Order order, SystemModel settings, string name = "")
        {
            Parallel.Invoke(
                () => ConfirmationEmail(order, settings, name),
                () => ConfirmationText(order, settings, name),
                () => ConfirmationEmail(order, settings, name, false),
                () => ConfirmationText(order, settings, name, false)
            );
        }

        private void ConfirmationEmail(Data.Models.Payment.Order order, SystemModel settings, string name, bool isCustomer = true)
        {
            try
            {
                var subject = $"{settings.Get(SettingName.Title)} - {(isCustomer ? settings.Get(SettingName.OrderConfirmationEmailSubject) : $"New Order {OrderPrefix}{order.Id}")}";
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
                var twilio = new TwilioHelper(settings.Get(SettingName.TwilioAuthToken), settings.Get(SettingName.TwilioSid), settings.Get(SettingName.TwilioPhoneNumber));

                if (twilio.IsValid)
                {
                    ISmsSender smsSender = new TwilioSmsSender(twilio.Sid, twilio.AuthToken);
                    if (isCustomer && !string.IsNullOrWhiteSpace(order.Phone))
                        smsSender.Send(twilio.Phone, order.Phone, GetBody(order, name, settings, true));

                    if (!isCustomer)
                    {
                        var phoneNumbersString = settings.Get(SettingName.OrderNotificationPhoneNumbers);
                        if (!string.IsNullOrWhiteSpace(phoneNumbersString))
                        {
                            var phoneNumbers = phoneNumbersString.Split(new[] { ',', ' ', ';' }, StringSplitOptions.RemoveEmptyEntries).Where(x => x.Length == 10 && x.All(c => char.IsDigit(c)));
                            foreach (var phoneNumber in phoneNumbers)
                            {
                                try { smsSender.Send(twilio.Phone, $"+1{phoneNumber}", GetBody(order, name, settings, false)); }
                                catch (Exception ex) { Log(ex); }
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
            name = string.IsNullOrWhiteSpace(name) ? order.Email : name;
            var title = settings.Get(SettingName.Title);
            return isCustomer
                ? $"{name}, here is your Order Confirmation:{n}{n}{order.FullText}{n}{n}Thank you!{n}-{title}"
                : $"order {OrderPrefix}{order.Id} for {name}{n}{n}{order.FullText}";
        }
    }
}