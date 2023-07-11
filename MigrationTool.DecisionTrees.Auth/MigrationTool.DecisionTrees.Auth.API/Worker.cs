using MigrationTool.DecisionTrees.Auth.API.Data;
using OpenIddict.Abstractions;
using System.Globalization;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace MigrationTool.DecisionTrees.Auth.API
{
    public class Worker : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public Worker(IServiceProvider serviceProvider)
            => _serviceProvider = serviceProvider;

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            await context.Database.EnsureCreatedAsync(cancellationToken);

            await RegisterApplicationsAsync(scope.ServiceProvider);
            await RegisterScopesAsync(scope.ServiceProvider);

            static async Task RegisterApplicationsAsync(IServiceProvider provider)
            {
                var manager = provider.GetRequiredService<IOpenIddictApplicationManager>();

                // Angular UI client
                if (await manager.FindByClientIdAsync("angularclient") is null)
                {
                    await manager.CreateAsync(new OpenIddictApplicationDescriptor
                    {
                        ClientId = "angularclient",
                        ConsentType = ConsentTypes.Explicit,
                        DisplayName = "angular client PKCE",
                        DisplayNames =
                        {
                            [CultureInfo.GetCultureInfo("es-ES")] = "Application cliente MVC"
                        },
                        PostLogoutRedirectUris =
                        {
                            new Uri("http://localhost:4200"),
                            new Uri("https://localhost:4200")
                        },
                        RedirectUris =
                        {
                            new Uri("http://localhost:4200"),
                            new Uri("https://localhost:4200")
                        },
                        Permissions =
                        {
                            Permissions.Endpoints.Authorization,
                            Permissions.Endpoints.Logout,
                            Permissions.Endpoints.Token,
                            Permissions.Endpoints.Revocation,
                            Permissions.GrantTypes.AuthorizationCode,
                            Permissions.GrantTypes.RefreshToken,
                            Permissions.GrantTypes.Password,
                            Permissions.ResponseTypes.Code,
                            Permissions.ResponseTypes.IdToken,
                            Permissions.Scopes.Email,
                            Permissions.Scopes.Profile,
                            Permissions.Scopes.Roles,
                            $"{Permissions.Prefixes.Scope}decisiontrees.api"
                        },
                        Requirements =
                        {
                            Requirements.Features.ProofKeyForCodeExchange
                        }
                    });
                }

                // Swashbuckle & NSwag
                if (await manager.FindByClientIdAsync("swaggerclient") == null)
                {
                    await manager.CreateAsync(new OpenIddictApplicationDescriptor
                    {
                        ClientId = "swaggerclient",
                        ClientSecret = "901564A5-E7FE-42CB-B10D-61EF6A8F3654",
                        ConsentType = ConsentTypes.Explicit,
                        DisplayName = "Swagger client application",
                        RedirectUris =
                        {
                           new Uri("http://localhost:5000/swagger/oauth2-redirect.html"),
                           new Uri("http://localhost:5004/swagger/oauth2-redirect.html")
                        },
                        Permissions =
                        {
                           Permissions.Endpoints.Authorization,
                           Permissions.Endpoints.Logout,
                           Permissions.Endpoints.Token,
                           Permissions.GrantTypes.AuthorizationCode,
                           Permissions.ResponseTypes.Code,
                           Permissions.Scopes.Email,
                           Permissions.Scopes.Profile,
                           Permissions.Scopes.Roles,
                           $"{Permissions.Prefixes.Scope}decisiontrees.api"
                        }
                    });
                }

                // Decision Trees API
                if (await manager.FindByClientIdAsync("rs_decisiontrees.api") == null)
                {
                    var descriptor = new OpenIddictApplicationDescriptor
                    {
                        ClientId = "rs_decisiontrees.api",
                        ClientSecret = "901564A5-E799-42CB-B10D-61EF6A8F3654",
                        Permissions =
                        {
                            Permissions.Endpoints.Introspection
                        }
                    };

                    await manager.CreateAsync(descriptor);
                }
            }

            static async Task RegisterScopesAsync(IServiceProvider provider)
            {
                var manager = provider.GetRequiredService<IOpenIddictScopeManager>();

                if (await manager.FindByNameAsync("decisiontrees.api") is null)
                {
                    await manager.CreateAsync(new OpenIddictScopeDescriptor
                    {
                        DisplayName = "Decision Trees API access",
                        DisplayNames =
                        {
                            [CultureInfo.GetCultureInfo("es-ES")] = "Access to the Decision Trees API"
                        },
                        Name = "decisiontrees.api",
                        Resources =
                        {
                            "rs_decisiontrees.api"
                        }
                    });
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
