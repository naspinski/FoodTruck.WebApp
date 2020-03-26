using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Events;
using Naspinski.FoodTruck.Data.Distribution.Models.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class SettingsModel
    {
        public string Title { get; set; }
        public string TagLine { get; set; }
        public string Description { get; set; }
        public string LogoImageUrl { get; set; }
        public string BannerImageUrl { get; set; }
        public bool IsBrickAndMortar { get; set; }
        public bool IsOrderingOn { get; set; }
        public bool IsApplyOn { get; set; }
        public string HomeUrl { get; set; }
        public string GoogleMapsApiKey { get; set; }
        public Dictionary<string, string> DeliveryServiceImageToUrl { get; set; } = new Dictionary<string, string>();
        public Dictionary<string, string> Social { get; set; } = new Dictionary<string, string>();
        public Dictionary<string, Schedule> Schedule { get; set; }  = new Dictionary<string, Schedule>();
        public bool ShowSchedule { get { return Schedule.Any(x => !x.Value.Hours.Equals("closed", StringComparison.InvariantCultureIgnoreCase)); } }
        
        private SystemModel _system;
        
        public SettingsModel(Uri homeUrl, SystemModel system, FoodTruckContext context)
        {
            _system = system;
            HomeUrl = homeUrl?.ToString() ?? string.Empty;

            Title = system.Settings[SettingName.Title];
            TagLine = system.Settings[SettingName.Tagline];
            Description = system.Settings[SettingName.Description];
            LogoImageUrl = system.Settings[SettingName.LogoImageUrl];
            BannerImageUrl = system.Settings[SettingName.BannerImageUrl];

            if (system != null)
            {
                IsBrickAndMortar = SetBool(SettingName.BrickAndMortarMode, true);
                IsApplyOn = SetBool(SettingName.IsApplyOn);
                IsOrderingOn = SetBool(SettingName.IsOrderingOn);

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

        public Schedule(string day, Dictionary<string, string> viewData)
        {
            if (viewData != null)
            {
                Open = viewData[$"{day}Open"] == null ? string.Empty : viewData[$"{day}Open"].ToString();
                Close = viewData[$"{day}Close"] == null ? string.Empty : viewData[$"{day}Close"].ToString();
            }
        }
    }
}
