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

        [Required]
        [Column("Name", TypeName = "nvarchar(150)")]
        public string? Name { get; set; }

        [Required]
        [Column("Date")]
        public DateTime Date { get; set; }

        [ForeignKey("DecisionTreeId")]
        public List<Item>? Items { get; set; }
    }
}
