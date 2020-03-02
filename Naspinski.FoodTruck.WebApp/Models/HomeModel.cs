using Naspinski.FoodTruck.Data.Distribution.Models.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class HomeModel
    {
        public string Title { get; set; }
        public string TagLine { get; set; }
        public string Description { get; set; }
        public string LogoImageUrl { get; set; }
        public bool IsBrickAndMortar { get; set; }
        public bool IsOrderingOn { get; set; }
        public bool IsApplyOn { get; set; }
        public string HomeUrl { get; set; }
        public Dictionary<string, string> DeliveryServiceImageToUrl { get; set; } = new Dictionary<string, string>();
        public LocationModel Location { get; set; }
        public Dictionary<string, Schedule> Schedule { get; set; }  = new Dictionary<string, Schedule>();
        public bool ShowSchedule { get { return Schedule.Any(x => !x.Value.Hours.Equals("closed", StringComparison.InvariantCultureIgnoreCase)); } }
        
        private SystemModel _system;
        
        public HomeModel(Uri homeUrl, SystemModel system)
        {
            _system = system;
            HomeUrl = homeUrl?.ToString() ?? string.Empty;

            Title = system.Settings[SettingName.Title];
            TagLine = system.Settings[SettingName.Tagline];
            Description = system.Settings[SettingName.Description];
            LogoImageUrl = system.Settings[SettingName.LogoImageUrl];

            if (system != null)
            {
                IsBrickAndMortar = SetBool(SettingName.BrickAndMortarMode, true);
                IsApplyOn = SetBool(SettingName.IsApplyOn);
                IsOrderingOn = SetBool(SettingName.IsOrderingOn);

                SetLink(SettingName.DoorDashLink, "https://cdn.doordash.com/media/button/209x45_white.png");
                SetLink(SettingName.GrubHubLink, "grubhub.jpg");
                SetLink(SettingName.PostmatesLink, "postmates.png");

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
