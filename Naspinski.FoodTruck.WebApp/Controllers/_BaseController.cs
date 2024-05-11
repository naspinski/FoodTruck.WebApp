using System;
using System.Text;
using System.Text.Json;
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

        protected void Log(string message, params object[] objects)
        {
            var msg = new StringBuilder(message);
            var opts = new JsonSerializerOptions { WriteIndented = true };
            foreach (var obj in objects)
            {
                msg.AppendLine(JsonSerializer.Serialize(obj, opts));
            }
            Log(new Exception(msg.ToString()));
        }
    }
}