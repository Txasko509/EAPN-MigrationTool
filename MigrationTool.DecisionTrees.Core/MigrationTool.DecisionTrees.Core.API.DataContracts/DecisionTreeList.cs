using System;
using System.ComponentModel.DataAnnotations;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class DecisionTreeList
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
