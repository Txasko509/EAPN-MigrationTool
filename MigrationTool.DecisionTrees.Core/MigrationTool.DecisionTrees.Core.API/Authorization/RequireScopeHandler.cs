using MigrationTool.DecisionTrees.Core.API.Common.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using OpenIddict.Abstractions;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MigrationTool.DecisionTrees.Core.API.Authorization
{
    public class RequireScopeHandler : AuthorizationHandler<RequireScope>
    {
        private readonly AppSettings _settings;

        public RequireScopeHandler(IOptions<AppSettings> settings)
        {
            _settings = settings.Value;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context, RequireScope requirement)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));
            if (requirement == null)
                throw new ArgumentNullException(nameof(requirement));

            var scopeClaim = context.User.Claims.FirstOrDefault(t => t.Type == "scope");

            if (scopeClaim != null && (context.User.HasScope(_settings.Authentication.OpenIddict.Scope)))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
