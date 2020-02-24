using CohesiveSoftware.Messaging.Email;
using Microsoft.AspNetCore.Mvc;
using Naspinski.Data.Interfaces;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Menu;
using Naspinski.FoodTruck.Data.Distribution.Models.System;
using Naspinski.FoodTruck.WebApp.Models;
using System;
using System.Net.Mail;
using System.Text;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : BaseController
    {
        private ICrudHandler<SettingModel, FoodTruckContext, SettingModel> _handler;
        private readonly AzureSettings _azureSettings;
        private readonly SquareSettings _squareSettings;

        public HomeController(FoodTruckContext context, AzureSettings azureSettings, ElmahSettings elmahSettings, SquareSettings squareSettings) : base(context, elmahSettings)
        {
            _azureSettings = azureSettings;
            _squareSettings = squareSettings;
        }

        public HomeModel Index()
        {
            var system = new SystemModel(new SettingHandler(_context).GetAll());
            return new HomeModel(new Uri(_azureSettings.HomeUrl), system);
        }

        [HttpPost]
        public IActionResult Contact(ContactModel model)
        {
            var system = new SystemModel(new SettingHandler(_context).GetAll());
            if (model != null)
            {
                var contactEmail = system.Settings[SettingName.ContactEmail];
                EmailSender.Send(_azureSettings.SendgridApiKey,
                    $"{system.Settings[SettingName.Title]} - {model.Type} - {model.Email}",
                    MakeMessage(model), contactEmail, model.Email,
                    model.Attachment == null || model.Attachment.Length == 0 ? null : new[] { model.Attachment });
            }
            return Ok();
        }

        private string MakeMessage(ContactModel model)
        {
            var n = Environment.NewLine;
            var sb = new StringBuilder($"{model.Email}{n}{n}{model.Message}{n}{n}");

            if (!string.IsNullOrWhiteSpace(model.Location))
                sb.AppendLine($" - Location: {model.Location}");

            if (!string.IsNullOrWhiteSpace(model.DateTime))
                sb.AppendLine($" - Date/Time: {model.DateTime}");

            return sb.ToString();
        }
    }
}