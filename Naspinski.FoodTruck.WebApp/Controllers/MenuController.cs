using Microsoft.AspNetCore.Mvc;
using Naspinski.Data.Interfaces;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Handlers.Menu;
using Naspinski.FoodTruck.Data.Distribution.Models.Menu;
using System.Collections.Generic;
using System.Linq;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/menu")]
    [ApiController]
    public class MenuController : BaseController
    {
        private ICrudHandler<MenuItemModel, FoodTruckContext, MenuItemModel> _handler;

        public MenuController(FoodTruckContext context) : base(context)
        {
            _handler = new MenuItemHandler(_context, "system");
        }

        [HttpGet]
        [Route("")]
        public IEnumerable<CategoryModel> Get()
        {
            var model = new MenuItemsModel(_handler.GetAll(false));
            model.Categories.ForEach(cat => {
                cat.MenuItems.ForEach(item => item.Prices.ForEach(p => p.PriceTypeName = p.PriceTypeName.Replace(" ", "&nbsp;")));
                cat.MenuItems = cat.MenuItems.OrderBy(x => x.SortOrder).ToList();
            });

            //populate the options
            foreach (var combo in model.Categories.SelectMany(x => x.MenuItems).Where(x => x.ComboParts != null & x.ComboParts.Any()))
                combo.ComboParts.ForEach(x => x.PopulateOptions(model.Categories));

            return model.Categories;
        }
    }
}