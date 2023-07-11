using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class SaveChoice
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [Required]
        [JsonPropertyName("text")]
        public string Text { get; set; }

        [Required]
        [JsonPropertyName("order")]
        public int Order { get; set; }

        [JsonPropertyName("gotoItem")]
        public SaveItem GotoItem { get; set; }

        [JsonPropertyName("GotoItemId")]
        public int? GotoItemId { get; set; }
    }
}
