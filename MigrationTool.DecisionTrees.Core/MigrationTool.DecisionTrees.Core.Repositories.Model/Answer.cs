using System.ComponentModel.DataAnnotations.Schema;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    [Table("Answer")]
    public class Answer : Item
    {
        [Column("TextLink", TypeName = "nvarchar(500)")]
        public string? TextLink { get; set; }

        [Column("Info", TypeName = "nvarchar(1000)")]
        public string? Info { get; set; }
    }
}
