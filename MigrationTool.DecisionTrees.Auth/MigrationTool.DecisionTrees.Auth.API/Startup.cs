using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using MigrationTool.DecisionTrees.Auth.API.Data;
using MigrationTool.DecisionTrees.Auth.API.Swagger;
using MigrationTool.DecisionTrees.Auth.Common.Settings;
using Quartz;
using Serilog;
using Swashbuckle.AspNetCore.SwaggerGen;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MigrationTool.DecisionTrees.Auth.API
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

                    services.AddControllersWithViews();
                    services.AddRazorPages();

                    //SWAGGER
                    if (_appSettings.Swagger.Enabled)
                    {
                        services.Configure<AppSettings>(Configuration)
                            .AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>()
                            .AddSwaggerGen();
                    }

                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        // Configure the context to use Microsoft SQL Server.
                        options.UseMySql(Configuration.GetConnectionString("DefaultConnection"), ServerVersion.AutoDetect(Configuration.GetConnectionString("DefaultConnection")));

                        // Register the entity sets needed by OpenIddict.
                        // Note: use the generic overload if you need
                        // to replace the default OpenIddict entities.
                        options.UseOpenIddict();
                    });

                    services.AddIdentity<ApplicationUser, IdentityRole>()
                    .AddEntityFrameworkStores<ApplicationDbContext>()
                    .AddDefaultTokenProviders()
                    .AddDefaultUI();

                    //.AddTokenProvider<Fido2UserTwoFactorTokenProvider>("FIDO2");

                    //services.Configure<Fido2Configuration>(Configuration.GetSection("fido2"));
                    //services.AddScoped<Fido2Store>();

                    services.AddDistributedMemoryCache();

                    services.AddSession(options =>
                    {
                        options.IdleTimeout = TimeSpan.FromMinutes(2);
                        options.Cookie.HttpOnly = true;
                        options.Cookie.SameSite = SameSiteMode.None;
                        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                    });

                    services.Configure<IdentityOptions>(options =>
                    {
                        // Configure Identity to use the same JWT claims as OpenIddict instead
                        // of the legacy WS-Federation claims it uses by default (ClaimTypes),
                        // which saves you from doing the mapping in your authorization controller.
                        options.ClaimsIdentity.UserNameClaimType = Claims.Name;
                        options.ClaimsIdentity.UserIdClaimType = Claims.Subject;
                        options.ClaimsIdentity.RoleClaimType = Claims.Role;
                        options.ClaimsIdentity.EmailClaimType = Claims.Email;

                        // Note: to require account confirmation before login,
                        // register an email sender service (IEmailSender) and
                        // set options.SignIn.RequireConfirmedAccount to true.
                        //
                        // For more information, visit https://aka.ms/aspaccountconf.
                        options.SignIn.RequireConfirmedAccount = true;
                    });

                    // OpenIddict offers native integration with Quartz.NET to perform scheduled tasks
                    // (like pruning orphaned authorizations/tokens from the database) at regular intervals.
                    services.AddQuartz(options =>
                    {
                        options.UseMicrosoftDependencyInjectionJobFactory();
                        options.UseSimpleTypeLoader();
                        options.UseInMemoryStore();
                    });

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

                    // Register the Quartz.NET service and configure it to block shutdown until jobs are complete.
                    services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);

                    services.AddOpenIddict()
                    .AddCore(options =>
                    {
                        options.UseEntityFrameworkCore()
                              .UseDbContext<ApplicationDbContext>();
                        
                        options.UseQuartz();
                    })
                    .AddServer(options =>
                    {
                        // Enable the authorization, logout, token and userinfo endpoints.
                        options.SetAuthorizationEndpointUris("connect/authorize")
                           .SetIntrospectionEndpointUris("connect/introspect")
                           .SetLogoutEndpointUris("connect/logout")
                           .SetTokenEndpointUris(new[] { "connect/token", "connect/token-by-password" })
                           .SetUserinfoEndpointUris("connect/userinfo")
                           .SetVerificationEndpointUris("connect/verify");

                        options.AllowAuthorizationCodeFlow()
                               .AllowHybridFlow()
                               .AllowClientCredentialsFlow()
                               .AllowRefreshTokenFlow()
                               .AllowImplicitFlow()
                               .AllowPasswordFlow();

                        options.RegisterScopes(Scopes.OpenId, Scopes.Email, Scopes.Profile, Scopes.Roles, "decisiontrees.api");

                        //options.AddDevelopmentEncryptionCertificate()
                        //       .AddDevelopmentSigningCertificate();

                        //options.AddEncryptionCertificate()

                        #region create encryption certificate
                        //using var algorithm = RSA.Create(keySizeInBits: 2048);

                        //var subject = new X500DistinguishedName("CN=Fabrikam Encryption Certificate");
                        //var request = new CertificateRequest(subject, algorithm, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                        //request.CertificateExtensions.Add(new X509KeyUsageExtension(X509KeyUsageFlags.KeyEncipherment, critical: true));

                        //var certificate = request.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddYears(2));

                        //File.WriteAllBytes("encryption-certificate.pfx", certificate.Export(X509ContentType.Pfx, string.Empty));
                        #endregion


                        //options.AddEncryptionCertificate(new X509Certificate2("encryption-certificate.pfx", "", X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.Exportable));

                        #region create signing certificate
                        //using var algorithm = RSA.Create(keySizeInBits: 2048);

                        //var subject = new X500DistinguishedName("CN=Fabrikam Signing Certificate");
                        //var request = new CertificateRequest(subject, algorithm, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                        //request.CertificateExtensions.Add(new X509KeyUsageExtension(X509KeyUsageFlags.DigitalSignature, critical: true));

                        //var certificate = request.CreateSelfSigned(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddYears(2));

                        //File.WriteAllBytes("signing-certificate.pfx", certificate.Export(X509ContentType.Pfx, string.Empty));
                        #endregion

                        //options.AddSigningCertificate(new X509Certificate2("signing-certificate.pfx", "", X509KeyStorageFlags.MachineKeySet | X509KeyStorageFlags.Exportable));

                        options.AddEphemeralEncryptionKey().AddEphemeralSigningKey();


                        // Accept anonymous clients (i.e clients that don't send a client_id).
                        //options.AcceptAnonymousClients();


                        options.UseAspNetCore()
                               .EnableAuthorizationEndpointPassthrough()
                               .EnableLogoutEndpointPassthrough()
                               .EnableTokenEndpointPassthrough()
                               .EnableUserinfoEndpointPassthrough()
                               .EnableStatusCodePagesIntegration()
                               .DisableTransportSecurityRequirement();
                    })
                    .AddValidation(options =>
                    {
                        options.UseLocalServer();
                        options.UseAspNetCore();
                    });

                    services.AddHostedService<Worker>();

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

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            Log.Information("Startup::Configure");
            Log.Debug($"Startup::Configure::Environment:{env.EnvironmentName}");

            try
            {
                IdentityModelEventSource.ShowPII = true;

                //SWAGGER
                if (_appSettings.IsValid())
                {
                    if (_appSettings.Swagger.Enabled)
                    {
                        app.UseSwagger();
                        app.UseSwaggerUI(options =>
                        {
                            options.SwaggerEndpoint("../swagger/v1/swagger.json", "Eapn Decision trees Auth API V1");
                            options.OAuthScopeSeparator(" ");
                        });
                    }
                }

                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }
                else
                {
                    app.UseStatusCodePagesWithReExecute("~/error");
                }

                app.UseRouting();

                app.UseCors("AllowAllOrigins");

                //app.UseHttpsRedirection();
                app.UseStaticFiles();               

                app.UseAuthentication();
                app.UseAuthorization();

                IdentityDataInitializer.SeedRoles(roleManager);
                IdentityDataInitializer.SeedDefaultUser(userManager);

                app.UseSession();

                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapDefaultControllerRoute();
                    endpoints.MapRazorPages();
                });
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
            }
        }
    }
}
