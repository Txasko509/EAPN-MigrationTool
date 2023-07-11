using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles
{
    public class AnswerProfile : Profile
    {
        public AnswerProfile()
        {
            // Mapping Answer properties
            CreateMap<S.Answer, DC.AnswerDetail>()
                .ForMember(dest =>
               dest.TextLink,
               opt => opt.MapFrom(src => src.TextLink))
                .ForMember(dest =>
               dest.Info,
               opt => opt.MapFrom(src => src.Info));

            // Mapping SaveAnswer properties
            CreateMap<DC.SaveAnswer, S.Answer>()
                 .ForMember(dest =>
               dest.TextLink,
               opt => opt.MapFrom(src => src.TextLink))
                 .ForMember(dest =>
               dest.Info,
               opt => opt.MapFrom(src => src.Info));
        }
    }
}
