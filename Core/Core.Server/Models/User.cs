using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Server.Models
{
    public class User: IdentityUser
    {
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string SurName { get; set; }

        [MaxLength(10)]
        public string Level { get; set; }

        [Column(TypeName="datetime")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        [Column(TypeName = "datetime")]
        public DateTime LastLogin { get; set; } = DateTime.Now;

        public bool IsAdmin { get; set; } = false;

        // Add these two properties
        public int TotalQuestions { get; set; } = 33; // This will always be 33 as you mentioned

        public int TotalAnsweredQuestions { get; set; } = 0; // Default value is 0, you can increment this as users answer questions

    }
}
