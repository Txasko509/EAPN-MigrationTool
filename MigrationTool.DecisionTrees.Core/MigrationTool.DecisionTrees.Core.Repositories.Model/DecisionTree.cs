using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    [Table("DecisionTree")]
    public class DecisionTree
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("DecisionTreeId")]
        public int DecisionTreeId { get; set; }

        [Column("Description", TypeName = "nvarchar(500)")]
        public string? Description { get; set; }

        [ForeignKey("DecisionTreeId")]
        public List<Item>? Items { get; set; }
    }
}
