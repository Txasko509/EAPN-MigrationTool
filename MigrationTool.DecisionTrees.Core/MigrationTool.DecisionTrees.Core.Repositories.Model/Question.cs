using System.ComponentModel.DataAnnotations.Schema;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    [Table("Question")]
    public class Question : Item
    {
        [ForeignKey("ItemId")]
        public List<Choice>? Choices { get; set; }
    }
}
