using MigrationTool.DecisionTrees.Core.API.DataContracts.Converters;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    [JsonConverter(typeof(SaveItemConverter))]
    public abstract class SaveItem
    {
        [JsonPropertyName("id")]
        public int? Id { get; set; }

        [Required]
        [JsonPropertyName("order")]
        public int Order { get; set; }

        [Required]
        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("subText")]
        public string SubText { get; set; }           

        [JsonPropertyName("decisionTreeId")]
        public int? DecisionTreeId { get; set; }
    }
}
