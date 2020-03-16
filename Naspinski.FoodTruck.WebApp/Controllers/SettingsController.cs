using Microsoft.AspNetCore.Mvc;
using Naspinski.Data.Interfaces;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Menu;
using Naspinski.FoodTruck.Data.Distribution.Models.System;
using Naspinski.FoodTruck.WebApp.Models;
using System;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/settings")]
    [ApiController]
    public class SettingsController : BaseController
    {
        private ICrudHandler<SettingModel, FoodTruckContext, SettingModel> _handler;
        private readonly AzureSettings _azureSettings;

        public SettingsController(FoodTruckContext context, AzureSettings azureSettings) : base(context)
        {
            _azureSettings = azureSettings;
            _handler = new SettingHandler(_context);
        }

        [HttpGet]
        [Route("")]
        public SettingsModel Get()
        {
            var system = new SystemModel(_handler.GetAll());
            return new SettingsModel(new Uri(_azureSettings.HomeUrl), system, _context);
        }
    }
}