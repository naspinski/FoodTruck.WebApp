using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Naspinski.FoodTruck.WebApp.Models
{
    public class ContactModel
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }

        public string Location { get; set; }

        public string DateTime { get; set; }

        [Required]
        public string Type { get; set; }

        public IFormFile Attachment { get; set; }
    }
}
