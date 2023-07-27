using MigrationTool.DecisionTrees.Core.API.Common.Settings;
using IdentityModel.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Net.Http;


namespace MigrationTool.DecisionTrees.Core.API.OpenApi
{
    public class ConfigureSwaggerGenOptions : IConfigureOptions<SwaggerGenOptions>
    {
        private readonly AppSettings _settings;
        private readonly IHttpClientFactory _httpClientFactory;

        public ConfigureSwaggerGenOptions(
            IOptions<AppSettings> settings,
            IHttpClientFactory httpClientFactory)
        {
            _settings = settings.Value;
            _httpClientFactory = httpClientFactory;
        }

        public void Configure(SwaggerGenOptions options)
        {
            var discoveryDocument = GetDiscoveryDocument();

            options.OperationFilter<AuthorizeOperationFilter>();
            options.DescribeAllParametersInCamelCase();
            options.CustomSchemaIds(x => x.FullName);
            options.SwaggerDoc("v1", CreateOpenApiInfo());

            options.AddSecurityDefinition("OAuth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        AuthorizationUrl = new Uri(discoveryDocument.AuthorizeEndpoint + "?nonce=\"asdf\""),
                        TokenUrl = new Uri(discoveryDocument.TokenEndpoint),
                        Scopes = new Dictionary<string, string>
                        {
                            { _settings.Authentication.OpenIddict.Scope, "API access" }
                        }
                    }
                },
                Description = "Decision trees API Server OpenId Security Scheme"
            });
        }

        private DiscoveryDocumentResponse GetDiscoveryDocument()
        {
            return _httpClientFactory
                .CreateClient()
                .GetDiscoveryDocumentAsync(new DiscoveryDocumentRequest
                {

                    Address = _settings.Authentication.OpenIddict.Issuer,
                    Policy =
                    {
                        RequireHttps = _settings.Authentication.OpenIddict.RequireHttpsMetadata,
                        ValidateIssuerName = false,
                        ValidateEndpoints = false,
                        RequireKeySet = false
                    }
                })
                .GetAwaiter()
                .GetResult();
        }

        private OpenApiInfo CreateOpenApiInfo()
        {
            return new OpenApiInfo()
            {
                Title = "Decision trees Core - Rest API",
                Version = "v1",
                Description = "Rest API especification for Decision trees Core API",
                Contact = new OpenApiContact() { Name = "API", Url = new Uri("http://localhost") },
                License = new OpenApiLicense()
            };
        }
    }
}
