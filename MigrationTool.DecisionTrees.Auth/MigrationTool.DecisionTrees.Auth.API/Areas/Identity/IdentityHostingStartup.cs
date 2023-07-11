[assembly: HostingStartup(typeof(MigrationTool.DecisionTrees.Auth.API.Areas.Identity.IdentityHostingStartup))]
namespace MigrationTool.DecisionTrees.Auth.API.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) => {
            });
        }
    }
}
