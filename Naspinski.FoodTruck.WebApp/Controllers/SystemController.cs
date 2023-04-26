using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Events;
using Naspinski.FoodTruck.Data.Distribution.Handlers.System;
using Naspinski.FoodTruck.Data.Distribution.Models.Events;
using Naspinski.FoodTruck.Data.Distribution.Models.System;
using Naspinski.FoodTruck.Data.Models.System;
using Naspinski.FoodTruck.WebApp.Models;
using Naspinski.Messaging.Email;
using Naspinski.Messaging.Sms;
using Naspinski.Messaging.Sms.Twilio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api")]
    [ApiController]
    public class SystemController : BaseController
    {
        private const string subscriptionDelimeter = "---";
        private SubscriptionHandler _handler;
        private SettingHandler _settingHandler;
        private SystemModel _settings;
        private readonly AzureSettings _azureSettings;

        public SystemController(FoodTruckContext context, AzureSettings azureSettings) : base(context)
        {
            _azureSettings = azureSettings;
            _handler = new SubscriptionHandler(_context);
            _settingHandler = new SettingHandler(_context);

            _settings = new SystemModel(_settingHandler.Get(new[] {
                SettingName.Title,
                SettingName.ContactEmail,
                SettingName.TwilioAuthToken,
                SettingName.TwilioPhoneNumber,
                SettingName.TwilioSid,
                SettingName.OrderNotificationEmails,
                SettingName.Location
            }));
        }

        [HttpGet]
        [Route("location")]
        public LocationModel Location()
        {
            var locationIdString = _settings.Get(SettingName.Location);
            int locationId;
            return int.TryParse(locationIdString, out locationId) ? new LocationHandler(_context, "system").Get(locationId) : new LocationModel();
        }

        [HttpGet]
        [Route("u/{subscriberLocation}")]
        public string Unsubscribe(string subscriberLocation = "subscriber---location")
        {
            if (subscriberLocation != "subscriber---location")
            {
                var split = subscriberLocation.Split(subscriptionDelimeter);
                _handler.Delete(split[0], split.Length > 1 ? split[1] : string.Empty);
            }
            return "unsubscribed";
        }

        [HttpPost]
        [Route("subscribe")]
        public SubscriptionModel Subscribe(SubscribeModel model)
        {
            var n = Environment.NewLine;
            var subscription = _handler.Insert(model.Subscriber, model.Location);
            var title = _settings.Get(SettingName.Title);
            var subject = $"{title} subscription to {model.Location} confirmed";
            var protocol = HttpContext.Request.Host.Value.Contains("localhost") ? "http" : "https";
            var message = $"{title} thanks you! You will receive one notification in the morning when we will be at {model.Location}.{n}";
            message += $"{n}unsubscribe from this location: {Url.Action("Unsubscribe", "System", new { subscriberLocation = $"{subscription.Subscriber}{subscriptionDelimeter}{subscription.Location}" }, protocol)}";
            message += $"{n}unsubscribe from all locations: {Url.Action("Unsubscribe", "System", new { subscriberLocation = subscription.Subscriber }, protocol)}";

            if (subscription.Type == Subscription.Types.Email)
            {
                var from = _settings.Get(SettingName.ContactEmail);
                EmailSender.Send(_azureSettings.SendgridApiKey, subject, message, subscription.Subscriber, from);
            }
            else if (subscription.Type == Subscription.Types.Text)
            {
                var twilio = new TwilioHelper(_settings.Get(SettingName.TwilioAuthToken), _settings.Get(SettingName.TwilioSid), _settings.Get(SettingName.TwilioPhoneNumber));
                if (!twilio.IsValid)
                    throw new Exception("Twilio is not properly set up");

                ISmsSender smsSender = new TwilioSmsSender(twilio);
                smsSender.Send(twilio.Phone, $"+1{subscription.Subscriber}", message);
            }
            else
                throw new NotImplementedException($"Subscription.Type of {subscription.Type} is not implemented yet");

            return subscription;
        }

        [HttpGet]
        [Route("valid-delivery-location/{zip}/{city}")]
        public bool IsValidDeliveryLocation(string zip, string city)
        {
            var deliveryDestinations = new DeliveryDestinationHandler(_context, "system").GetAll();
            if (!deliveryDestinations.Any()) return true;

            city = city.ToLower().Trim();
            var whitelistCities = deliveryDestinations.Where(x => x.IsCity && x.IsWhiteList).Select(x => x.Value.ToLower().Trim()).ToList();
            if (whitelistCities.Contains(city))
                return true;
            var blacklistCities = deliveryDestinations.Where(x => x.IsCity && x.IsBlacklist).Select(x => x.Value.ToLower().Trim()).ToList();
            if (blacklistCities.Contains(city))
                return false;

            zip = zip.ToLower().Trim();
            if (zip.Length > 5) zip = zip.Substring(0, 5);
            var whitelistZips = deliveryDestinations.Where(x => x.IsZipCode && x.IsWhiteList && x.Value.Trim().Length > 4)
                .Select(x => x.Value.ToLower().Trim().Substring(0, 5)).ToList();
            if (whitelistZips.Contains(zip))
                return true;

            return false;
        }

        [HttpGet]
        [Route("sections")]
        public List<string> Sections()
        {
            return _settingHandler.GetAvailableSections();
        }

        [HttpGet]
        [Route("siblings")]
        public IEnumerable<SiblingSiteModel> Siblings()
        {
            return new SiblingSiteHandler(_context, "system").GetAll().OrderBy(x => x.Name);
        }

        [HttpPost]
        [Route("contact")]
        public IActionResult Contact([FromForm]ContactModel model)
        {
            var system = new SystemModel(_settingHandler.Get(new[] { SettingName.Title, SettingName.ContactEmail }));
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

        private static string MakeMessage(ContactModel model)
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