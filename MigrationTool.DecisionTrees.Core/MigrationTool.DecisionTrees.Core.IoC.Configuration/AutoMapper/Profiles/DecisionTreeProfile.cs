using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles.Studies
{
    public class DecisionTreeProfile : Profile
    {
        public DecisionTreeProfile()
        {
            // Mapping DecisionTreeList properties
            CreateMap<S.DecisionTree, DC.DecisionTreeList>()
               .ForMember(dest =>
               dest.Id,
               opt => opt.MapFrom(src => src.DecisionTreeId))
                .ForMember(dest =>
               dest.Date,
               opt => opt.MapFrom(src => src.Date))
                .ForMember(dest =>
               dest.Name,
               opt => opt.MapFrom(src => src.Name));

            // Mapping DecisionTreeDetail properties
            CreateMap<S.DecisionTree, DC.DecisionTreeDetail>()
               .ForMember(dest =>
               dest.Id,
               opt => opt.MapFrom(src => src.DecisionTreeId))
               .ForMember(dest =>
               dest.Date,
               opt => opt.MapFrom(src => src.Date))
                .ForMember(dest =>
               dest.Name,
               opt => opt.MapFrom(src => src.Name))
                .ForMember(dest =>
               dest.Items,
               opt => opt.MapFrom(src => src.Items));

            // Mapping SaveDecisionTree properties
            CreateMap<DC.SaveDecisionTree, S.DecisionTree>()
                 .ForMember(dest =>
               dest.Name,
               opt => opt.MapFrom(src => src.Name))
                 .ForMember(dest =>
               dest.Items,
               opt => opt.MapFrom(src => src.Items));
        }
    }
}
