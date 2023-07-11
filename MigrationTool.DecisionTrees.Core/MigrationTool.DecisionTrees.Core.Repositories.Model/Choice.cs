using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    [Table("Choice")]
    public class Choice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ChoiceId")]
        public int ChoiceId { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        [Column("Text", TypeName = "nvarchar(150)")]
        public string? Text { get; set; }

        [Column("GotoItemId")]
        [ForeignKey("GotoItem")]
        public int? GotoItemId { get; set; }

        public Item? GotoItem { get; set; }

        [Required]
        [Column("ItemId")]
        public int ItemId { get; set; }
    }
}
