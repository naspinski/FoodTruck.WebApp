using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Access.AdditionalModels;
using Square;
using Square.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Naspinski.FoodTruck.WebApp.Helpers
{
    public class SquareHelper
    {
        public SquareClient Client;

        public string LocationId;
        public string AccessToken;
        public Square.Environment Env;
        public bool UseProduction { get { return Env == Square.Environment.Production; } }


        private const double DEBUG_TAX = 6.9;

        public SquareHelper(SquareSettings squareSettings)
        {
            Env = squareSettings.UseProductionApi ? Square.Environment.Production : Square.Environment.Sandbox;
            AccessToken = squareSettings.UseProductionApi ? squareSettings.ProductionAccessToken : squareSettings.SandboxAccessToken;
            LocationId = squareSettings.UseProductionApi ? squareSettings.ProductionLocationId : squareSettings.SandboxLocationId;

            Client = new SquareClient.Builder()
                .Environment(Env)
                .AccessToken(AccessToken)
                .Build();
        }

        public async Task<IEnumerable<CatalogObject>> GetTaxes()
        {
            var bodyObjectTypes = new List<string>() { "TAX" };
            var body = new SearchCatalogObjectsRequest.Builder()
                .ObjectTypes(bodyObjectTypes)
                .Limit(100)
                .Build();

            var response = await Client.CatalogApi.SearchCatalogObjectsAsync(body);
            return response.Objects;
        }

        public async Task<decimal> GetAdditiveTaxPercentage(IEnumerable<CatalogObject> taxes = null)
        {
            return await GetTaxPercentage("ADDITIVE", taxes);
        }

        public async Task<decimal> GetInclusiveTaxPercentage(IEnumerable<CatalogObject> taxes = null)
        {
            return await GetTaxPercentage("INCLUSIVE", taxes);
        }

        public async Task<decimal> GetTaxPercentage(string inclusion_type, IEnumerable<CatalogObject> taxes = null)
        {
            var _taxes = taxes ?? await GetTaxes();

            return _taxes == null 
                ? Convert.ToDecimal(0)
                : _taxes.Select(x => x.TaxData)
                    .Where(x => x.InclusionType == inclusion_type && !string.IsNullOrWhiteSpace(x.Percentage))
                    .Sum(x => Decimal.Parse(x.Percentage));
        }

        public async Task<CreateOrderRequest> GetCreateOrderRequest(PaymentModel model, Data.Models.Payment.Order order, Guid guid, IEnumerable<CatalogObject> taxes)
        {
            var add = await GetAdditiveTaxPercentage(taxes);
            var inc = await GetInclusiveTaxPercentage(taxes);
            var orderLineItems = order.Items.Select(x => x.ToOrderLineItem()).ToList();

            var _taxes = (taxes ?? new List<CatalogObject>())
                .Select(x => new OrderLineItemTax(
                    name: x.TaxData.Name,
                    type: x.TaxData.InclusionType,
                    percentage: x.TaxData.Percentage)
                ).ToList();

            model.PickUpInMinutes = string.IsNullOrWhiteSpace(model.PickUpInMinutes) ? "0" : model.PickUpInMinutes;
            var pickUpInMinutes = 0;
                int.TryParse(model.PickUpInMinutes, out pickUpInMinutes);

            var isScheduled = false;
            if (pickUpInMinutes > 0)
                isScheduled = true;
            else
                pickUpInMinutes = 10;

            var pickupDetails = new OrderFulfillmentPickupDetails(
                recipient: new OrderFulfillmentRecipient(displayName: model.Name, emailAddress: model.Email, phoneNumber: model.Phone),
                scheduleType: (isScheduled ? "SCHEDULED" : "ASAP"),
                prepTimeDuration: "P10M", // 10 minutes
                pickupAt: ToRfc3339String(DateTime.UtcNow.AddMinutes(pickUpInMinutes))
            );

            var fulfill = new List<OrderFulfillment>() {
                new OrderFulfillment(
                    type: "PICKUP",
                    pickupDetails:  pickupDetails
                   )};

            var squareOrder = new Square.Models.Order(LocationId,
                taxes: _taxes,
                referenceId: order.Id.ToString(),
                customerId: model.Email,  
                lineItems: orderLineItems, 
                fulfillments: fulfill
            );

            var orderRequest = new CreateOrderRequest(squareOrder, guid.ToString());

            return orderRequest;
        }

        public int GetTotalInCents(CreateOrderRequest orderRequest)
        {
            var subtotalInCents = orderRequest.Order.LineItems.Sum(x => Convert.ToInt32(x.BasePriceMoney.Amount * Int32.Parse(x.Quantity)));

            var tax = orderRequest.Order.Taxes
                .Where(x => x.Type == "ADDITIVE")
                .Sum(x => Decimal.Parse(x.Percentage));

            return Convert.ToInt32(subtotalInCents * (1 + tax / 100));
        }

        public string ToRfc3339String(DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fffzzz", DateTimeFormatInfo.InvariantInfo);
        }
    }
}
