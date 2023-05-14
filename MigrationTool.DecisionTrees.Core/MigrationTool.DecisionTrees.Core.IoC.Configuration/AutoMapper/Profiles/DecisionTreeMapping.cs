using AutoMapper;

namespace MigrationTool.DecisionTrees.Core.IoC.Configuration.AutoMapper.Profiles.Studies
{
    public class DecisionTreeMapping
    {
        public static IMapper Mapper { get; }
        static DecisionTreeMapping()
        {
            Mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<DecisionTreeProfile>();
                cfg.AddProfile<ItemProfile>();
                cfg.AddProfile<QuestionProfile>();
                cfg.AddProfile<AnswerProfile>();
                cfg.AddProfile<ChoiceProfile>();
            }).CreateMapper();
        }
    }
}
