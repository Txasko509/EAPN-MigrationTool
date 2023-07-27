using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MigrationTool.DecisionTrees.Core.Api.IoC.Configuration.DI;
using MigrationTool.DecisionTrees.Core.API.Authorization;
using MigrationTool.DecisionTrees.Core.API.Common.Settings;
using MigrationTool.DecisionTrees.Core.API.OpenApi;
using MigrationTool.DecisionTrees.Core.API.Swagger;
using OpenIddict.Validation.AspNetCore;
using Serilog;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;

#pragma warning disable CS1591
namespace MigrationTool.DecisionTrees.Core.API
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment HostingEnvironment { get; private set; }

        private IConfigurationSection _appsettingsConfigurationSection;
        private AppSettings _appSettings;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            HostingEnvironment = env;
            Configuration = configuration;

            //AppSettings
            _appsettingsConfigurationSection = Configuration.GetSection(nameof(AppSettings));
            if (_appsettingsConfigurationSection == null)
                throw new Exception("No appsettings has been found");

            _appSettings = _appsettingsConfigurationSection.Get<AppSettings>();

            //Configure logger
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            Log.Debug("Startup::Constructor::Settings loaded");
        }

        public void ConfigureServices(IServiceCollection services)
        {
            Log.Information("Startup::ConfigureServices");

            try
            {
                if (_appSettings.IsValid())
                {
                    Log.Debug("Startup::ConfigureServices::valid AppSettings");

                    services.Configure<AppSettings>(_appsettingsConfigurationSection);
                    Log.Debug("Startup::ConfigureServices::AppSettings loaded for DI");

                    services.AddControllers();

                    //SWAGGER
                    if (_appSettings.Swagger.Enabled)
                    {
                        services.Configure<AppSettings>(Configuration)
                            .AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerGenOptions>()
                            .AddSwaggerGen();
                    }

                    // Repository settings
                    services.ConfigureDbContext(Configuration);

                    //Mappings
                    services.ConfigureMappings();

                    //Business settings            
                    services.ConfigureBusinessServices();

                    // Enable CORS
                    services.AddCors(options =>
                    {
                        var origins = Configuration.GetValue<string>("AllowedOrigins").Split(';');
                        options.AddPolicy("AllowAllOrigins",
                            builder =>
                            {
                                builder
                                    .AllowCredentials()
                                    .WithOrigins(origins)
                                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                            });
                    });

                    var guestPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .RequireClaim("scope", _appSettings.Authentication.OpenIddict.Scope)
                    .Build();

                    services.AddAuthentication(options =>
                    {
                        options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
                    });

                    // Register the OpenIddict validation components.
                    services.AddOpenIddict()
                        .AddValidation(options =>
                        {
                            // Note: the validation handler uses OpenID Connect discovery
                            // to retrieve the address of the introspection endpoint.
                            options.SetIssuer(_appSettings.Authentication.OpenIddict.Issuer);
                            options.AddAudiences(_appSettings.Authentication.OpenIddict.Audience);

                            // Configure the validation handler to use introspection and register the client
                            // credentials used when communicating with the remote introspection endpoint.
                            options.UseIntrospection()
                                    .SetClientId(_appSettings.Authentication.OpenIddict.ClientId)
                                    .SetClientSecret(_appSettings.Authentication.OpenIddict.ClientSecret);

                            // Register the System.Net.Http integration.
                            options.UseSystemNetHttp();

                            // Register the ASP.NET Core host.
                            options.UseAspNetCore();
                        });

                    services.AddScoped<IAuthorizationHandler, RequireScopeHandler>();

                    services.AddAuthorization(options =>
                    {
                        options.AddPolicy("RequireDecisionTreesScope", policy =>
                        {
                            policy.Requirements.Add(new RequireScope());
                        });
                    });

                    Log.Debug("Startup::ConfigureServices::ApiVersioning, Swagger and DI settings");
                }
                else
                    Log.Debug("Startup::ConfigureServices::invalid AppSettings");
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Log.Information("Startup::Configure");
            Log.Debug($"Startup::Configure::Environment:{env.EnvironmentName}");

            try
            {
                //SWAGGER
                if (_appSettings.IsValid())
                {
                    if (_appSettings.Swagger.Enabled)
                    {
                        app.UseSwagger();
                        app.UseSwaggerUI(options =>
                        {
                            options.SwaggerEndpoint("../swagger/v1/swagger.json", "Eapn Decision Trees API V1");
                            options.OAuthClientId(_appSettings.Swagger.ClientId);
                            options.OAuthClientSecret(_appSettings.Swagger.ClientSecret);
                            options.OAuthScopeSeparator(" ");
                            options.OAuth2RedirectUrl(_appSettings.Swagger.RedirectUri);
                        });
                    }
                }

                app.UseSerilogRequestLogging();
                app.UseRouting();
                app.UseCors("AllowAllOrigins");
                app.UseAuthentication();
                app.UseAuthorization();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
            }
        }
    }
}
