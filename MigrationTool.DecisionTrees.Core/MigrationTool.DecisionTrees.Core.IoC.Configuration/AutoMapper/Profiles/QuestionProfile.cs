using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile()
        {
            // Mapping Question properties
            CreateMap<S.Question, DC.QuestionDetail>()
                .ForMember(dest =>
               dest.Choices,
               opt => opt.MapFrom(src => src.Choices));

            // Mapping SaveQuestion properties
            CreateMap<DC.SaveQuestion, S.Question>()
                 .ForMember(dest =>
               dest.Choices,
               opt => opt.MapFrom(src => src.Choices));
        }
    }
}
