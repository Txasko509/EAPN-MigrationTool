using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class SaveAnswer : SaveItem
    {
        [JsonPropertyName("textLink")]
        public string TextLink { get; set; }

        [JsonPropertyName("info")]
        public string Info { get; set; }
    }
}
