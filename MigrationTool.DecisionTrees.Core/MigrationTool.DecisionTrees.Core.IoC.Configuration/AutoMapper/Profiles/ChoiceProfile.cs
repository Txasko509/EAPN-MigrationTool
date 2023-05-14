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
               dest.Text,
               opt => opt.MapFrom(src => src.Text))
                .ForMember(dest =>
               dest.GotoItemId,
               opt => opt.MapFrom(src => src.GotoItemId));
        }
    }
}
