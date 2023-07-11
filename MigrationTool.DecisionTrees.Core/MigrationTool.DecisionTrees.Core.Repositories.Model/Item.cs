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
        public int Order { get; set; }

        [Required]
        [Column("Text")]
        public string? Text { get; set; }

        [Column("SubText", TypeName = "nvarchar(2000)")]
        public string? SubText { get; set; }

        [Required]
        [Column("DecisionTreeId")]
        public int DecisionTreeId { get; set; }        
    }
}
