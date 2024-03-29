﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class DecisionTreeDetail
    {
        [Required]
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string? Name { get; set; }

        public List<ItemDetail> Items { get; set; }
    }
}
