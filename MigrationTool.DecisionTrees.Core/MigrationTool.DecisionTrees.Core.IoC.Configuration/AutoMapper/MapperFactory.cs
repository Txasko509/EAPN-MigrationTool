using AutoMapper;
using System;
using System.Collections.Generic;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper
{
    public class MapperFactory : IMapperFactory
    {
        public Dictionary<string, IMapper> Mappers { get; set; } = new Dictionary<string, IMapper>();
        public IMapper GetMapper(string mapperName)
        {
            return Mappers[mapperName];
        }

        IMapper IMapperFactory.GetMapper(string mapperName)
        {
            throw new NotImplementedException();
        }
    }
}
