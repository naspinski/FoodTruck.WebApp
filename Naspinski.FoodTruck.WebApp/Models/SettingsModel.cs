using Naspinski.FoodTruck.Data;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class SettingsModel
    {
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string TagLine { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }
        public string Keywords { get; set; }
        public string LogoImageUrl { get; set; }
        public string BannerImageUrl { get; set; }
        public string FaviconImageUrl { get; set; }
        public string HomeUrl { get; set; }
        public string ContactPhone { get; set; } 

        public bool IsBrickAndMortar { get; set; }
        public bool IsOrderingOn { get; set; }
        public bool IsTextOn { get; set; }
        public bool IsApplyOn { get; set; }
        public bool IsValidTimeForOnlineOrder { get; set; } = false;
        public int MinutesUntilClose { get; set; }
        public string GoogleMapsApiKey { get; set; }
        public Dictionary<string, string> DeliveryServiceImageToUrl { get; set; } = new Dictionary<string, string>();
        public Dictionary<string, string> Social { get; set; } = new Dictionary<string, string>();
        public Dictionary<string, Schedule> Schedule { get; set; }  = new Dictionary<string, Schedule>();
        public bool ShowSchedule { get { return Schedule.Any(x => !x.Value.Hours.Equals("closed", StringComparison.InvariantCultureIgnoreCase)); } }

        public bool SquareSandbox { get; set; }
        public string SquareApplicationId { get; set; }
        public string SquareLocationId { get; set; }

        private int TimeZoneOffsetFromUtcInHours;
        private int StopOrderingMinutesToClose;

        public dynamic Extra { get; set; }
        
        private SystemModel _system;
        
        public SettingsModel(AzureSettings azureSettings, SquareSettings squareSettings, SystemModel system, FoodTruckContext context)
        {
            _system = system;
            
            TimeZoneOffsetFromUtcInHours = -6;
            Int32.TryParse(system.Settings[SettingName.TimeZoneOffsetFromUtcInHours], out TimeZoneOffsetFromUtcInHours);
            StopOrderingMinutesToClose = 30;
            Int32.TryParse(system.Settings[SettingName.StopOrderingMinutesToClose], out StopOrderingMinutesToClose);

            HomeUrl = azureSettings.HomeUrl ?? string.Empty;
            SquareSandbox = !squareSettings.UseProductionApi;
            SquareApplicationId = SquareSandbox ? squareSettings.SandboxApplicationId : squareSettings.ProductionApplicationId;
            SquareLocationId = SquareSandbox ? squareSettings.SandboxLocationId : squareSettings.ProductionLocationId;

            Title = system.Settings[SettingName.Title];
            SubTitle = system.Settings[SettingName.SubTitle];
            TagLine = system.Settings[SettingName.Tagline];
            Description = system.Settings[SettingName.Description];
            Author = system.Settings[SettingName.Author];
            Keywords = system.Settings[SettingName.Keywords];
            LogoImageUrl = system.Settings[SettingName.LogoImageUrl];
            BannerImageUrl = system.Settings[SettingName.BannerImageUrl];
            FaviconImageUrl = system.Settings[SettingName.FaviconImageUrl];
            ContactPhone = system.Settings[SettingName.ContactPhone];
            
            if (system != null)
            {
                IsBrickAndMortar = SetBool(SettingName.BrickAndMortarMode, true);
                IsApplyOn = SetBool(SettingName.IsApplyOn);
                IsOrderingOn = SetBool(SettingName.IsOrderingOn);
                IsTextOn = SetBool(SettingName.IsTextOn);

                GoogleMapsApiKey = _system.Get(SettingName.GoogleMapsApiKey);

                SetLink(SettingName.DoorDashLink, "https://cdn.doordash.com/media/button/209x45_white.png");
                SetLink(SettingName.GrubHubLink, "grubhub.jpg");
                SetLink(SettingName.PostmatesLink, "postmates.png");

                foreach (string s in new[] { SettingName.Facebook, SettingName.Twitter, SettingName.Instagram, SettingName.LinkedIn, SettingName.Pinterest })
                    AddValueToDictionaryIfValid(Social, s);

                foreach (var d in Enumerable.Range(0, 7))
                {
                    var day = ((DayOfWeek)d).ToString();
                    Schedule.Add(day, new Schedule(day, system.Settings));
                }

                IsValidTimeForOnlineOrder = GetIsValidTimeForOnlineOrder();
            }
        }

        private bool SetBool(string setting, bool defaultValue = false)
        {
            var _bool = false;
            return bool.TryParse(_system.Settings[setting], out _bool) ? _bool : defaultValue;
        }

        private void SetLink(string setting, string imageUrl)
        {
            if (!string.IsNullOrWhiteSpace(_system.Settings[setting]))
                DeliveryServiceImageToUrl.Add(imageUrl, _system.Settings[setting]);
        }

        private void AddValueToDictionaryIfValid<T>(Dictionary<string, T> dictionary, string setting) where T: class
        {
            if (!string.IsNullOrWhiteSpace(_system.Settings[setting]))
                dictionary.Add(setting, _system.Settings[setting] as T);
        }
        public bool GetIsValidTimeForOnlineOrder()
        {

            var now = DateTime.Now.AddHours(TimeZoneOffsetFromUtcInHours).ToUniversalTime();
            var today = Schedule[now.DayOfWeek.ToString()];

            if (string.IsNullOrEmpty(today.Open) || string.IsNullOrEmpty(today.Close))
                return false;

            var open = GetTodaysDateTimeFrom(today.Open);
            var stopOrders = GetTodaysDateTimeFrom(today.Close).AddMinutes(0 - StopOrderingMinutesToClose);

            var stillTakingOrders = now >= open && now < stopOrders;

            MinutesUntilClose = 0;
            if (stillTakingOrders && IsBrickAndMortar)
                MinutesUntilClose = (int)(GetTodaysDateTimeFrom(today.Close) - now).TotalMinutes;

            if (!IsBrickAndMortar && IsOrderingOn)
                return true;


            var _time = $"{DateTime.Now.Date.ToShortDateString()} {open}";
            var _open = DateTime.ParseExact(_time, "M/d/yyyy hh:mm tt", CultureInfo.InvariantCulture).AddHours(TimeZoneOffsetFromUtcInHours).ToUniversalTime();

            Extra = new
            {
                now = now.ToString(),
                today,
                open = open.ToString(),
                stopOrders = stopOrders.ToString(),
                _open
            };

            return stillTakingOrders;
        }

        /// <summary>
        /// get today's datetime given an am/pm string
        /// </summary>
        /// <param name="time">time in HH:mm AM/PM format</param>
        private DateTime GetTodaysDateTimeFrom(string time)
        {
            time = $"{DateTime.Now.Date.ToShortDateString()} {time}";
            return DateTime.ParseExact(time, "M/d/yyyy hh:mm tt", CultureInfo.InvariantCulture).AddHours(TimeZoneOffsetFromUtcInHours).ToUniversalTime();
        }
    }


    public class Schedule
    {
        public string Open;
        public string Close;
        public string Hours
        {
            get
            {
                var openClose = new List<string>() { Open, Close }.Where(x => !string.IsNullOrWhiteSpace(x));
                return openClose.Count() > 1 ? string.Join(" - ", openClose) : "closed";
            }
        }

        public Schedule(string day, Dictionary<string, string> openToClose)
        {
            if (openToClose != null)
            {
                Open = openToClose[$"{day}Open"] == null ? string.Empty : openToClose[$"{day}Open"].ToString();
                Close = openToClose[$"{day}Close"] == null ? string.Empty : openToClose[$"{day}Close"].ToString();
            }
        }
    }
}
