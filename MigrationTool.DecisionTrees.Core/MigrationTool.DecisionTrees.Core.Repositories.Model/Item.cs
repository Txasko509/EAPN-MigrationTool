using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    [Table("Item")]
    public abstract class Item
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ItemId")]
        public int ItemId { get; set; }

        [Required]
        [Column("Text", TypeName = "nvarchar(500)")]
        public string? Text { get; set; }

        [Column("Subtext", TypeName = "nvarchar(1000)")]
        public string? Subtext { get; set; }

        [Required]
        [Column("DecisionTreeId")]
        public int DecisionTreeId { get; set; }
    }
}
