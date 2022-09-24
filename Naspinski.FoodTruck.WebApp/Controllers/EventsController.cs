using Ical.Net;
using Microsoft.AspNetCore.Mvc;
using Naspinski.FoodTruck.Data;
using Naspinski.FoodTruck.Data.Distribution.Models.Events;
using Naspinski.Maps.Implementations.Google;
using Naspinski.Maps.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using static Naspinski.FoodTruck.Data.Constants;

namespace Naspinski.FoodTruck.WebApp.Controllers
{
    [Route("api/events")]
    [ApiController]
    public class EventsController : BaseController
    {
        private Data.Distribution.Handlers.Events.EventHandler _handler;
        private readonly AzureSettings _azureSettings;

        public EventsController(FoodTruckContext context, AzureSettings azureSettings) : base(context)
        {
            _azureSettings = azureSettings;
            _handler = new Data.Distribution.Handlers.Events.EventHandler(_context, "system");
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<EventModel>> Get()
        {
            var settings = new Data.Access.Queries.Settings.Get(_context, new[]
            {
                SettingName.DaysInFutureToDisplay,
                SettingName.IcalUrl,
                SettingName.TimeZoneOffsetFromUtcInHours
            }).ExecuteAndReturnResults();

            var displayDaysIntoFuture = 30;
            var displayDaysIntoFutureSetting = settings.FirstOrDefault(x => x.Name == SettingName.DaysInFutureToDisplay);
            if (displayDaysIntoFutureSetting != null)
                int.TryParse(displayDaysIntoFutureSetting.Value, out displayDaysIntoFuture);

            var iCalUrl = settings.FirstOrDefault(x => x.Name == SettingName.IcalUrl)?.Value?.ToString() ?? string.Empty;
            var offset = -6;
            Int32.TryParse(settings.FirstOrDefault(x => x.Name == SettingName.TimeZoneOffsetFromUtcInHours)?.Value?.ToString() ?? (-6).ToString(), out offset);

            var iCalEvents = new List<EventModel>();
            var systemEvents = new List<EventModel>();

            systemEvents = GetSystemEvents(displayDaysIntoFuture);
            iCalEvents = await GetICalEvents(iCalUrl, displayDaysIntoFuture, offset);

            return iCalEvents.Union(systemEvents).OrderBy(x => x.Begins);
        }

        public List<EventModel> GetSystemEvents(int displayDaysIntoFuture)
        {
            return _handler.GetAll(DateTime.Now.Date, DateTime.Now.AddDays(displayDaysIntoFuture > 0 ? displayDaysIntoFuture : 1)).ToList();
        }

        public async Task<List<EventModel>> GetICalEvents(string iCalUrl, int displayDaysIntoFuture, int offset)
        {
            var events = new List<EventModel>();
            if (string.IsNullOrWhiteSpace(iCalUrl)) return events;

            string iCal = string.Empty;
            using (var client = new HttpClient()) { iCal = await client.GetStringAsync(iCalUrl); }

            var calendar = Calendar.Load(iCal);
            if (calendar != null)
            {
                var iCalEvents = calendar.Events.Distinct();

                events = iCalEvents.Where(x => x.DtStart.HasDate
                            && x.DtStart.Date < DateTime.Now.AddDays(displayDaysIntoFuture)
                            && x.DtStart.Date >= DateTime.Now.AddDays(-1)
                            ).Select(x => new EventModel()
                            {
                                Begins = new DateTimeOffset(x.DtStart.AsUtc).DateTime.AddHours(offset),
                                Ends = x.DtEnd.HasDate ? (DateTime?)new DateTimeOffset(x.DtEnd.AsUtc).DateTime.AddHours(offset) : null,
                                Location = new LocationModel()
                                {
                                    Name = x.Summary,
                                    Address = string.IsNullOrEmpty(x.Location) ? string.Empty : x.Location
                                }
                            }).Distinct().ToList();
            }
            var count = 0;
            events.ForEach(x => x.Id = 0 - (count++));

            return events;
        }

        [HttpGet]
        [Route("map/{address}")]
        public IAddress Map(string address)
        {
            var apiKey = new Data.Access.Queries.Settings.Get(_context, new[] { SettingName.GoogleMapsDeveloperApiKey }).ExecuteAndReturnResults().FirstOrDefault()?.Value;
            IAddress _address = new GoogleMap(apiKey).GetAddress(address);
            return _address;
        }
    }
}