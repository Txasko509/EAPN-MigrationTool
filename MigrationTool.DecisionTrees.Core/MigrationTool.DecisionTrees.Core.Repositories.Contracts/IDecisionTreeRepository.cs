using MigrationTool.DecisionTrees.Core.Repositories.Model;

namespace MigrationTool.DecisionTrees.Core.Repositories.Contracts
{
    public interface IDecisionTreeRepository
    {
        Task<DecisionTree?> GetAsync(int decisionTreeId);
    }
}
