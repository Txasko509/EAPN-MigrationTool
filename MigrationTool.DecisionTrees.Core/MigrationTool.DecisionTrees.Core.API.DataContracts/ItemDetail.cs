using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    [JsonDerivedType(typeof(QuestionDetail), typeDiscriminator: "question")]
    [JsonDerivedType(typeof(AnswerDetail), typeDiscriminator: "answer")]
    public class ItemDetail
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public string? Text { get; set; }

        public string? SubText { get; set; }

        public int DecisionTreeId { get; set; }
    }
}
