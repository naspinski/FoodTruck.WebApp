using Naspinski.FoodTruck.Data.Access.AdditionalModels;
using Naspinski.FoodTruck.Data.Distribution.Models.System;
using Naspinski.FoodTruck.Data.Models.Menu;
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

        public static string[] EXCLUDE = { "liquor", "alcohol" };

        public string LocationId;
        private string _accessToken;
        private Square.Environment _env;
        public bool UseProduction { get { return _env == Square.Environment.Production; } }

        public SquareHelper(SquareLocationModel location)
        {
            _env = location.ApplicationId.StartsWith("sandbox") ? Square.Environment.Sandbox : Square.Environment.Production;
            _accessToken = location.AccessToken;
            LocationId = location.LocationId;

            Client = new SquareClient.Builder()
                .Environment(_env)
                .AccessToken(_accessToken)
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

            var includedTaxes = _taxes == null
                ? new List<CatalogTax>()
                : _taxes.Select(x => x.TaxData)
                    .Where(x =>
                        x.InclusionType == inclusion_type
                        && !string.IsNullOrWhiteSpace(x.Percentage)
                        && !EXCLUDE.Any(y => x.Name.ToLower().Contains(y)));

            return includedTaxes.Sum(x => Decimal.Parse(x.Percentage));
        }

        public CreateOrderRequest GetCreateOrderRequest(PaymentModel model, Data.Models.Payment.Order order, Guid guid, IEnumerable<CatalogObject> taxes)
        {
            var orderLineItems = order.Items.Select(x => x.ToOrderLineItem()).ToList();

            if (!string.IsNullOrWhiteSpace(order.Note))
                orderLineItems.Add(new OrderLineItem(1.ToString(), null, "Order Note", null, order.Note, null, null, null, null, null, null, null, null, basePriceMoney: new Money(0, "USD")));

            var _taxes = (taxes ?? new List<CatalogObject>())
                .Where(x => !EXCLUDE.Any(y => x.TaxData.Name.ToLower().Contains(y)))
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

            var pickupDetails = new FulfillmentPickupDetails(
                recipient: new FulfillmentRecipient(displayName: model.Name, emailAddress: model.Email, phoneNumber: model.Phone),
                scheduleType: (isScheduled ? "SCHEDULED" : "ASAP"),
                prepTimeDuration: "P10M", // 10 minutes
                pickupAt: ToRfc3339String(DateTime.UtcNow.AddMinutes(pickUpInMinutes))
            );

            var fulfill = new List<Fulfillment>() {
                new Fulfillment(
                    type: "PICKUP",
                    pickupDetails:  pickupDetails
                   )};

            var squareOrder = new Square.Models.Order(LocationId,
                taxes: _taxes,
                referenceId: order.Id.ToString(),
                customerId: model.Email.Replace("@","_at_").Replace(".","-"),  
                lineItems: orderLineItems, 
                fulfillments: fulfill
            );

            var orderRequest = new CreateOrderRequest(squareOrder, guid.ToString());

            return orderRequest;
        }

        public int EstimateTotalInCents(CreateOrderRequest orderRequest)
        {
            var subtotalInCents = orderRequest.Order.LineItems.Sum(x => Convert.ToInt32(x.BasePriceMoney.Amount * Int32.Parse(x.Quantity)));

            var tax = orderRequest.Order.Taxes
                .Where(x => x.Type == "ADDITIVE"
                    && !EXCLUDE.Any(y => x.Name.ToLower().Contains(y)))
                    .Sum(x => Decimal.Parse(x.Percentage));

            var taxPlusTotal = 1 + tax / 100;
            var totalInCents = subtotalInCents * taxPlusTotal;
            var roundedTotalInCents = Math.Round(totalInCents);
            var intTotal = Convert.ToInt32(roundedTotalInCents);
            return intTotal;
        }

        public string ToRfc3339String(DateTime dateTime)
        {
            return dateTime.ToString("yyyy-MM-dd'T'HH:mm:ss.fffzzz", DateTimeFormatInfo.InvariantInfo);
        }
    }
}
