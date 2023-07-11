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
              dest.Order,
              opt => opt.MapFrom(src => src.Order))
               .ForMember(dest =>
              dest.Text,
              opt => opt.MapFrom(src => src.Text))
               .ForMember(dest =>
              dest.SubText,
              opt => opt.MapFrom(src => src.SubText))
                 .ForMember(dest =>
              dest.DecisionTreeId,
              opt => opt.MapFrom(src => src.DecisionTreeId));

            // Mapping AnswerDetail properties
            CreateMap<S.Item, DC.ItemDetail>()
                .Include<S.Answer, DC.AnswerDetail>()
                .ForMember(dest =>
              dest.Id,
              opt => opt.MapFrom(src => src.ItemId))
                .ForMember(dest =>
              dest.Order,
              opt => opt.MapFrom(src => src.Order))
               .ForMember(dest =>
              dest.Text,
              opt => opt.MapFrom(src => src.Text))
               .ForMember(dest =>
              dest.SubText,
              opt => opt.MapFrom(src => src.SubText))
                .ForMember(dest =>
              dest.DecisionTreeId,
              opt => opt.MapFrom(src => src.DecisionTreeId));

            //Mapping SaveItem properties
            CreateMap<DC.SaveItem, S.Item>()
                .Include<DC.SaveQuestion, S.Question>()
            .ForMember(dest =>
            dest.ItemId,
            opt => opt.MapFrom(src => src.Id))
             .ForMember(dest =>
            dest.Order,
            opt => opt.MapFrom(src => src.Order))
            .ForMember(dest =>
            dest.Text,
            opt => opt.MapFrom(src => src.Text))
            .ForMember(dest =>
            dest.SubText,
            opt => opt.MapFrom(src => src.SubText))           
            .ForMember(dest =>
            dest.DecisionTreeId,
            opt => opt.MapFrom(src => src.DecisionTreeId));

            //Mapping SaveItem properties
            CreateMap<DC.SaveItem, S.Item>()
                .Include<DC.SaveAnswer, S.Answer>()
            .ForMember(dest =>
            dest.ItemId,
            opt => opt.MapFrom(src => src.Id))
            .ForMember(dest =>
            dest.Order,
            opt => opt.MapFrom(src => src.Order))
            .ForMember(dest =>
            dest.Text,
            opt => opt.MapFrom(src => src.Text))
            .ForMember(dest =>
            dest.SubText,
            opt => opt.MapFrom(src => src.SubText))            
            .ForMember(dest =>
            dest.DecisionTreeId,
            opt => opt.MapFrom(src => src.DecisionTreeId));
        }
    }
}
