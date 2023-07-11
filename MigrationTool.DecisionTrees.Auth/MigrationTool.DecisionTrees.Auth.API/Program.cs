using MigrationTool.DecisionTrees.Auth.API;
using Microsoft.AspNetCore;
using Serilog;

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