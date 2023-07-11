using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class SaveQuestion : SaveItem
    {
        [JsonPropertyName("choices")]
        public IEnumerable<SaveChoice> Choices { get; set; }
    }
}
