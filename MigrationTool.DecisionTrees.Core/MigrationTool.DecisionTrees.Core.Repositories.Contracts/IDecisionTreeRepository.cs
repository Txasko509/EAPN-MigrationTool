using AspNetCore.IQueryable.Extensions.Pagination;
using AspNetCore.IQueryable.Extensions.Sort;
using MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.Repositories.Contracts
{
    public interface IDecisionTreeRepository
    {
        Task<IEnumerable<DecisionTree>> SearchByPropertiesAsync(DateTime? fromDate, DateTime? toDate, string? query, IQuerySort sort, IQueryPaging paging);

        Task<DecisionTree?> GetAsync(int decisionTreeId);

        Task<DecisionTree> CreateAsync(DecisionTree decisionTree);

        Task<bool> UpdateAsync(int decisionTreeId, DecisionTree decisionTree);

        Task<bool> RemoveAsync(int decisionTreeId);
    }
}
