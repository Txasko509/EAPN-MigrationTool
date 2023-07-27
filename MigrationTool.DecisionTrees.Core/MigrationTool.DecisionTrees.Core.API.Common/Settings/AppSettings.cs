using System.ComponentModel.DataAnnotations;

namespace MigrationTool.DecisionTrees.Core.API.Common.Settings
{
    public class AppSettings
    {
        [Required]
        public ApiSettings API { get; set; }

        [Required]
        public Swagger Swagger { get; set; }

        [Required]
        public Authentication Authentication { get; set; }
    }

    public class ApiSettings
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        public ApiContact Contact { get; set; }

        public string TermsOfServiceUrl { get; set; }

        public ApiLicense License { get; set; }
    }

    public class ApiContact
    {
        public string Name { get; set; }
        public string Email { get; set; }

        public string Url { get; set; }
    }

    public class ApiLicense
    {
        public string Name { get; set; }
        public string Url { get; set; }
    }

    public class Swagger
    {
        [Required]
        public bool Enabled { get; set; }

        [Required]
        public string ClientId { get; set; }

        [Required]
        public string ClientSecret { get; set; }

        [Required]
        public string RedirectUri { get; set; }
    }

    public class Authentication
    {
        public OpenIddict OpenIddict { get; set; }
    }

    public class OpenIddict
    {
        [Required]
        public string ClientId { get; set; }

        [Required]
        public string ClientSecret { get; set; }

        [Required]
        public string Audience { get; set; }

        [Required]
        public string Scope { get; set; }

        [Required]
        public string Issuer { get; set; }

        [Required]
        public bool RequireHttpsMetadata { get; set; }
    }
}
