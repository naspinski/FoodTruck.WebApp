using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Menu;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Payment;
using Naspinski.FoodTruck.WebApp.Helpers;
using Naspinski.FoodTruck.WebApp.Models;
using System.Collections.Generic;
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
        private readonly SquareSettings _squareSettings;
        private readonly AzureSettings _azureSettings;

        public PaymentController(FoodTruckContext context, SquareSettings squareSettings, AzureSettings azureSettings) : base(context)
        {
            _handler = new OrderHandler(context, "system");
            _squareSettings = squareSettings;
            _azureSettings = azureSettings;
            _settingHandler = new SettingHandler(_context);
        }

        [HttpGet]
        [Route("tax")]
        public async Task<decimal> GetTaxPercentage()
        {
            var settings = new SystemModel(new SettingHandler(this._context).Get(new[] { SettingName.SquareOnlineTaxId }));
            return await new SquareHelper(_squareSettings).GetAdditiveTaxPercentage();
        }

        [HttpPost]
        [Route("")]
        public IActionResult Pay(PaymentModel model)
        {

            return Ok();
        }

    }

    public class PaymentModel
    {
        public string OrderType { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public string Nonce { get; set; }
        public string BuyerVerificationToken { get; set; }

        public IEnumerable<PaymentModelItem> Items { get; set; }
    }

    public class PaymentModelItem
    {
        public int Quantity { get; set; }
        public string Name { get; set; }
        public string PriceTypeName { get; set; }
        public string Note { get; set; }
    }
}