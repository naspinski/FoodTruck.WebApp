using Naspinski.FoodTruck.Data;
using Square;
using Square.Apis;
using Square.Exceptions;
using Square.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Naspinski.FoodTruck.WebApp.Helpers
{
    public class SquareHelper
    {
        private SquareClient _squareClient;

        public SquareHelper(SquareSettings squareSettings)
        {
            var sqEnv = squareSettings.UseProductionApi ? Square.Environment.Production : Square.Environment.Sandbox;
            var sqAccessToken = squareSettings.UseProductionApi ? squareSettings.ProductionAccessToken : squareSettings.SandboxAccessToken;

            _squareClient = new SquareClient.Builder()
                .Environment(sqEnv)
                .AccessToken(sqAccessToken)
                .Build();
        }

        public async Task<IEnumerable<CatalogObject>> GetTaxes()
        {
            var bodyObjectTypes = new List<string>() { "TAX" };
            var body = new SearchCatalogObjectsRequest.Builder()
                .ObjectTypes(bodyObjectTypes)
                .Limit(100)
                .Build();

            var response = await _squareClient.CatalogApi.SearchCatalogObjectsAsync(body);
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
#if DEBUG
            if (_taxes == null)
                return Convert.ToDecimal(6.9);
#endif
            return _taxes == null 
                ? Convert.ToDecimal(0)
                : _taxes.Select(x => x.TaxData)
                    .Where(x => x.InclusionType == inclusion_type && !string.IsNullOrWhiteSpace(x.Percentage))
                    .Sum(x => Decimal.Parse(x.Percentage));
        }

        //public CreateOrderRequest GetCreateOrderRequest(Data.Models.Payment.Order order, Guid guid, IEnumerable<CatalogObject> taxes)
        //{
        //    var orderLineItems = order.Items.Select(x => x.ToOrderLineItem(GetAdditiveTaxPercentage(taxes), GetInclusiveTaxPercentage(taxes)));
        //    var _taxes = (taxes ?? new List<CatalogObject>()).Select(x => new CreateOrderRequestTax(null, x.TaxData.Name, Enum.Parse<CreateOrderRequestTax.TypeEnum>(x.TaxData.InclusionType.ToString()), x.TaxData.Percentage)).ToList();
        //    //var inclusiveTaxes = _taxes.Where(x => x.Type == CreateOrderRequestTax.TypeEnum.INCLUSIVE).ToList();

        //    var squareOrder = new CreateOrderRequest(
        //        IdempotencyKey: guid.ToString(),
        //        LineItems: orderLineItems.Select(x => new CreateOrderRequestLineItem(x.Name, x.Quantity, x.BasePriceMoney)).ToList(),
        //        Taxes: _taxes.Where(x => x.Type == CreateOrderRequestTax.TypeEnum.ADDITIVE).ToList()
        //    );

        //    return squareOrder;
        //}

        //public int GetTotalInCents(CreateOrderRequest squareOrder)
        //{
        //    var subtotalInCents = squareOrder.Order.LineItems.Sum(x => Convert.ToInt32(x.BasePriceMoney.Amount * Int32.Parse(x.Quantity)));
        //    //var itemTax = squareOrder.LineItems?.FirstOrDefault()?.Taxes?.Sum(x => Decimal.Parse(x.Percentage)) ?? 0;

        //    var tax = squareOrder.Taxes
        //        .Where(x => x.Type == CreateOrderRequestTax.TypeEnum.ADDITIVE)
        //        .Sum(x => Decimal.Parse(x.Percentage));
        //    return Convert.ToInt32(subtotalInCents * (1 + tax / 100));
        //}
    }
}
