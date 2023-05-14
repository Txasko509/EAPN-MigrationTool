using AutoMapper;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper
{
    public interface IMapperFactory
    {
        IMapper GetMapper(string mapperName = "");
    }
}
