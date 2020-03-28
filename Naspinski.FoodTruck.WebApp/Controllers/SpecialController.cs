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
            var specials = _handler.GetAll(false).OrderBy(x => x.Begins).ThenBy(x => x.Name);
            var models = new Dictionary<string, List<SpecialModel>>()
            {
                {"Sunday", specials.Where(x => x.IsSunday).ToList() },
                {"Monday", specials.Where(x => x.IsMonday).ToList() },
                {"Tuesday", specials.Where(x => x.IsTuesday).ToList() },
                {"Wednesday", specials.Where(x => x.IsWednesday).ToList() },
                {"Thursday", specials.Where(x => x.IsThursday).ToList() },
                {"Friday", specials.Where(x => x.IsFriday).ToList() },
                {"Saturday", specials.Where(x => x.IsSunday).ToList() }
            };
            var sortedSpecials = new Dictionary<string, List<SpecialModel>>();
            foreach (var key in models.Keys)
            {
                if (!models[key].Any())
                {
                    models.Remove(key);
                }
            }
            foreach (var key in models.Keys)
            {
                var sorted = models[key].Where(x => !x.Name.Contains("happy hour", System.StringComparison.InvariantCultureIgnoreCase)).ToList();
                sorted.AddRange(models[key].Where(x => x.Name.Contains("happy hour", System.StringComparison.InvariantCultureIgnoreCase)).ToList());
                sortedSpecials.Add(key, sorted);
            }
            return sortedSpecials;
        }
    }
}