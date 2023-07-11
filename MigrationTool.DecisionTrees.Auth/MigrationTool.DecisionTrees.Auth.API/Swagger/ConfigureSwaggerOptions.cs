using MigrationTool.DecisionTrees.Auth.Common.Settings;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace MigrationTool.DecisionTrees.Auth.API.Swagger
{
    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
    {
        readonly IConfiguration configuration;
        readonly AppSettings appSettings;

        public ConfigureSwaggerOptions(IConfiguration configuration)
        {
            this.configuration = configuration;

            appSettings = configuration.GetSection(nameof(AppSettings)).Get<AppSettings>();
        }


        public void Configure(SwaggerGenOptions options)
        {
            Configure(options, appSettings.API);
        }

        public void Configure(SwaggerGenOptions options, ApiSettings apiSettings)
        {
            if (options == null)
                throw new ArgumentNullException(nameof(options));

            if (apiSettings == null)
                throw new ArgumentNullException(nameof(apiSettings));

        }

        OpenApiInfo CreateInfoForApiVersion(ApiSettings apiSettings)
        {
            var info = new OpenApiInfo()
            {
                Title = $"{apiSettings.Title}",
                Version = "1.0",
                Description = apiSettings?.Description,
                Contact = (apiSettings != null && apiSettings.Contact != null) ? new OpenApiContact { Name = apiSettings.Contact.Name, Email = apiSettings.Contact.Email, Url = new Uri(apiSettings.Contact.Url) } : null,
                License = (apiSettings != null && apiSettings.License != null) ? new OpenApiLicense { Name = apiSettings.License.Name, Url = new Uri(apiSettings.License.Url) } : null,
                TermsOfService = !string.IsNullOrEmpty(apiSettings?.TermsOfServiceUrl) ? new Uri(apiSettings.TermsOfServiceUrl) : null
            };

            return info;
        }
    }
}
