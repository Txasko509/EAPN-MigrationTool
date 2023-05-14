using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles.Studies
{
    public class DecisionTreeProfile : Profile
    {
        public DecisionTreeProfile()
        {
            CreateMap<S.DecisionTree, DC.DecisionTreeDetail>()
               .ForMember(dest =>
               dest.Id,
               opt => opt.MapFrom(src => src.DecisionTreeId))
                .ForMember(dest =>
               dest.Description,
               opt => opt.MapFrom(src => src.Description))
                .ForMember(dest =>
               dest.Items,
               opt => opt.MapFrom(src => src.Items));
        }
    }
}
