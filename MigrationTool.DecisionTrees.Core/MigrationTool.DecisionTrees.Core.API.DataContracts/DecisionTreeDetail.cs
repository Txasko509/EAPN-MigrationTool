using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class DecisionTreeDetail
    {
        [Required]
        public int Id { get; set; }

        public string? Description { get; set; }

        public List<ItemDetail> Items { get; set; }
    }
}
