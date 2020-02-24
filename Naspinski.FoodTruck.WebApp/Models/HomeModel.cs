using Naspinski.FoodTruck.Data.Distribution.Models.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class HomeModel
    {
        public bool IsBrickAndMortar;
        public bool IsOrderingOn;
        public bool IsApplyOn;
        public string HomeUrl;
        public Dictionary<string, string> DeliveryServiceImageToUrl = new Dictionary<string, string>();
        public LocationModel Location;
        public Dictionary<string, Schedule> Schedule = new Dictionary<string, Schedule>();
        public bool ShowSchedule { get { return Schedule.Any(x => !x.Value.Hours.Equals("closed", StringComparison.InvariantCultureIgnoreCase)); } }

        public HomeModel(Uri homeUrl, SystemModel system)
        {
            HomeUrl = homeUrl?.ToString() ?? string.Empty;

            if (system != null)
            {
                bool.TryParse(system.Settings[SettingName.BrickAndMortarMode], out IsBrickAndMortar);
                bool.TryParse(system.Settings[SettingName.IsApplyOn], out IsApplyOn);
                bool.TryParse(system.Settings[SettingName.IsOrderingOn], out IsOrderingOn);

                if (!string.IsNullOrWhiteSpace(system.Settings[SettingName.DoorDashLink]))
                    DeliveryServiceImageToUrl.Add("https://cdn.doordash.com/media/button/209x45_white.png", system.Settings[SettingName.DoorDashLink]);
                if (!string.IsNullOrWhiteSpace(system.Settings[SettingName.GrubHubLink]))
                    DeliveryServiceImageToUrl.Add("grubhub.jpg", system.Settings[SettingName.GrubHubLink]);
                if (!string.IsNullOrWhiteSpace(system.Settings[SettingName.PostmatesLink]))
                    DeliveryServiceImageToUrl.Add("postmates.png", system.Settings[SettingName.PostmatesLink]);

                foreach (var d in Enumerable.Range(0, 7))
                {
                    var day = ((DayOfWeek)d).ToString();
                    Schedule.Add(day, new Schedule(day, system.Settings));
                }
            }
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
