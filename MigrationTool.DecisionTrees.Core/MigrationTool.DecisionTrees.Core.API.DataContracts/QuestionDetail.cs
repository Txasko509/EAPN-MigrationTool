using System.Collections.Generic;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class QuestionDetail : ItemDetail
    {
        public List<ChoiceDetail> Choices { get; set; }       
    }
}
