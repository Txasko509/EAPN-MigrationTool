using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class SaveDecisionTree
    {
        [Required]
        public string Name { get; set; }

        public IEnumerable<SaveItem> Items { get; set; }
    }
}
