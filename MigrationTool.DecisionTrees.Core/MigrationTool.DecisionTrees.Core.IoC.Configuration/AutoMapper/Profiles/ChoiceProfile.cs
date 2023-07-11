using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles
{
    public class ChoiceProfile : Profile
    {
        public ChoiceProfile()
        {
            // Mapping Choice properties
            CreateMap<S.Choice, DC.ChoiceDetail>()
                 .ForMember(dest =>
                dest.Id,
                opt => opt.MapFrom(src => src.ChoiceId))
                 .ForMember(dest =>
              dest.Order,
              opt => opt.MapFrom(src => src.Order))
                .ForMember(dest =>
               dest.Text,
               opt => opt.MapFrom(src => src.Text))
                .ForMember(dest =>
               dest.GotoItem,
               opt => opt.MapFrom(src => src.GotoItem))
                .ForMember(dest =>
               dest.GotoItemId,
               opt => opt.MapFrom(src => src.GotoItemId));

            // Mapping SaveAnswer properties
            CreateMap<DC.SaveChoice, S.Choice>()
                  .ForMember(dest =>
                dest.ChoiceId,
                opt => opt.MapFrom(src => src.Id))
                 .ForMember(dest =>
               dest.Text,
               opt => opt.MapFrom(src => src.Text))
                 .ForMember(dest =>
               dest.GotoItem,
               opt => opt.MapFrom(src => src.GotoItem));
        }
    }
}
