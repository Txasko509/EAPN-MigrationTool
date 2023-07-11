using System.ComponentModel.DataAnnotations;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class ChoiceDetail
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public string? Text { get; set; }

        public int? GotoItemId { get; set; }

        public ItemDetail GotoItem { get; set; }
    }
}
