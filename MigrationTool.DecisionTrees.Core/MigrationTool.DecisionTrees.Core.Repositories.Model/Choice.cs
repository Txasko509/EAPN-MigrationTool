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
        [Column("Text", TypeName = "nvarchar(150)")]
        public string? Text { get; set; }

        [Column("GotoItemId")]
        public int? GotoItemId { get; set; }

        [Column("ItemId")]
        public int? ItemId { get; set; }
    }
}
