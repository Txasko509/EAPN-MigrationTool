using AutoMapper;
using DC = MigrationTool.DecisionTrees.Core.API.DataContracts;
using S = MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles
{
    public class ItemProfile : Profile
    {
        public ItemProfile()
        {
            // Mapping QuestionDetail properties
            CreateMap<S.Item, DC.ItemDetail>()
                .Include<S.Question, DC.QuestionDetail>()
                .ForMember(dest =>
              dest.Id,
              opt => opt.MapFrom(src => src.ItemId))
               .ForMember(dest =>
              dest.Text,
              opt => opt.MapFrom(src => src.Text))
               .ForMember(dest =>
              dest.Subtext,
              opt => opt.MapFrom(src => src.Subtext));

            // Mapping AnswerDetail properties
            CreateMap<S.Item, DC.ItemDetail>()
                .Include<S.Answer, DC.AnswerDetail>()
                .ForMember(dest =>
              dest.Id,
              opt => opt.MapFrom(src => src.ItemId))
               .ForMember(dest =>
              dest.Text,
              opt => opt.MapFrom(src => src.Text))
               .ForMember(dest =>
              dest.Subtext,
              opt => opt.MapFrom(src => src.Subtext));
        }
    }
}
