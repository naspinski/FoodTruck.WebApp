using Naspinski.FoodTruck.Data.Distribution.Models.System;
using System.Collections.Generic;
using System.Linq;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class SystemModel
    {
        public Dictionary<string, string> Settings;

        public SystemModel() { }
        public SystemModel(IEnumerable<SettingModel> settings)
        {
            Settings = settings.ToDictionary(key => key.Name, val => val.Value);
        }

        public string Get(string setting)
        {
            return Settings.FirstOrDefault(x => x.Key == setting).Value;
        }
    }
}
