using Microsoft.AspNetCore.Mvc;
using Naspinski.Data.Interfaces;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Specials;
using Naspinski.FoodTruck.Data.Distribution.Models.Specials;
using System.Collections.Generic;
using System.Linq;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/specials")]
    [ApiController]
    public class SpecialController : BaseController
    {
        private ICrudHandler<SpecialModel, FoodTruckContext, SpecialModel> _handler;

        public SpecialController(FoodTruckContext context) : base(context)
        {
            _handler = new SpecialHandler(_context, "system");
        }

        [HttpGet]
        [Route("")]
        public Dictionary<string, List<SpecialModel>> Get()
        {
            var specials = _handler.GetAll(false).OrderBy(x => x.BeginsString).ThenBy(x => x.Name);
            var model = new Dictionary<string, List<SpecialModel>>()
            {
                {"Sunday", specials.Where(x => x.IsSunday).ToList() },
                {"Monday", specials.Where(x => x.IsMonday).ToList() },
                {"Tuesday", specials.Where(x => x.IsTuesday).ToList() },
                {"Wednesday", specials.Where(x => x.IsWednesday).ToList() },
                {"Thursday", specials.Where(x => x.IsThursday).ToList() },
                {"Friday", specials.Where(x => x.IsFriday).ToList() },
                {"Saturday", specials.Where(x => x.IsSunday).ToList() }
            };
            foreach(var key in model.Keys)
            {
                if (!model[key].Any())
                    model.Remove(key);
            }
            return model;
        }
    }
}