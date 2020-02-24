using System;
using Elmah.Io.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected readonly FoodTruckContext _context;
        protected readonly ElmahSettings _elmahSettings;

        public BaseController(FoodTruckContext context, ElmahSettings elmahSettings)
        {
            _context = context;
            _elmahSettings = elmahSettings;
        }

        protected void Log(Exception ex)
        {
            ex.Ship(HttpContext);
        }
    }
}