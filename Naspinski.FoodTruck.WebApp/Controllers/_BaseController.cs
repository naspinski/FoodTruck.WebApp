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

        public BaseController(FoodTruckContext context)
        {
            _context = context;
        }

        protected void Log(Exception ex)
        {
            ex.Ship(HttpContext);
        }
    }
}