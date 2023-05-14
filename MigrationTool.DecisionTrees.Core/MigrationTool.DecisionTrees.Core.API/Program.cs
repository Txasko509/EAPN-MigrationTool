using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Serilog;

#pragma warning disable CS1591
namespace MigrationTool.DecisionTrees.Core.API
{
    public class Program
    {
        [System.Obsolete]
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        //.NET 7
        [System.Obsolete]
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
            .UseStartup<Startup>()
            .UseSerilog();
    }
}
