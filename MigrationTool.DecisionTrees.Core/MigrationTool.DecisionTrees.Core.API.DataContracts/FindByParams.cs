using AspNetCore.IQueryable.Extensions.Pagination;
using AspNetCore.IQueryable.Extensions.Sort;

namespace MigrationTool.DecisionTrees.Core.API.DataContracts
{
    public class FindByParams : IQuerySort, IQueryPaging
    {
        public string Query { get; }

        public FindByParams(string query)
        {
            Query = query;
        }

        public string Sort { get; set; }

        public int? Limit { get; set; }

        public int? Offset { get; set; }
    }
}
