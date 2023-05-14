using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper;
using MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles.Studies;
using MigrationTool.DecisionTrees.Core.Repositories;
using MigrationTool.DecisionTrees.Core.Repositories.Context;
using MigrationTool.DecisionTrees.Core.Repositories.Contracts;
using System;
using System.Reflection;

namespace MigrationTool.DecisionTrees.Core.Api.IoC.Configuration.DI
{
    public static class ServiceCollectionExtensions
    {
        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            string mySqlConnectionStr = configuration.GetConnectionString("DefaultConnection");

            Action<DbContextOptionsBuilder> dbContextOptionsBuilder = db => db
                                                        .UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr), sql =>
                                                        {
                                                            sql.MigrationsAssembly("MigrationTool.DecisionTrees.Core.API");
                                                            sql.EnableRetryOnFailure();
                                                        })
                                                        .LogTo(Console.WriteLine, LogLevel.Information);

            services.AddDbContext<AdminDbContext>(dbContextOptionsBuilder);
        }

        public static void ConfigureBusinessServices(this IServiceCollection services)
        {
            if (services != null)
            {
                services.AddTransient<IDecisionTreeRepository, DecisionTreeRepository>();
            }
        }

        public static void ConfigureMappings(this IServiceCollection services)
        {
            if (services != null)
            {
                //Automap settings
                services.AddAutoMapper(Assembly.GetExecutingAssembly());

                var mapperFactory = new MapperFactory();
                mapperFactory.Mappers.Add("ObjectProfile", DecisionTreeMapping.Mapper);

                services.AddSingleton(mapperFactory);
            }
        }
    }
}
