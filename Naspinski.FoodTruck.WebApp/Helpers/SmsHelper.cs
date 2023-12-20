using Naspinski.Data.Helpers;
using Naspinski.FoodTruck.WebApp.Models;
using Naspinski.Messaging.Sms.Twilio;
using System;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Helpers
{
    public static class SmsHelper
    {
        public static void Send(string message, string toPhoneNumber, SystemModel settings)
        {
            var twilioAuth = settings.Get(SettingName.TwilioAuthToken);
            var twilioSid = settings.Get(SettingName.TwilioSid);
            var from = RegexHelper.DigitsOnly(settings.Get(SettingName.TwilioPhoneNumber));

            var twilio = new TwilioHelper(twilioAuth, twilioSid, from);
            if (!twilio.IsValid)
                throw new Exception("Twilio is not properly set up");

            TwilioClient.Init(twilioSid, twilioAuth);
            MessageResource.Create(
                body: message,
                from: new Twilio.Types.PhoneNumber($"+1{from}"),
                to: new Twilio.Types.PhoneNumber($"+1{toPhoneNumber}")
            );
        }
    }
}
