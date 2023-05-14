using Microsoft.EntityFrameworkCore;
using MigrationTool.DecisionTrees.Core.Repositories.Context;
using MigrationTool.DecisionTrees.Core.Repositories.Contracts;
using MigrationTool.DecisionTrees.Core.Repositories.Model;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace MigrationTool.DecisionTrees.Core.Repositories
{
    public class DecisionTreeRepository : IDecisionTreeRepository
    {
        private readonly AdminDbContext _dbContext;

        public DecisionTreeRepository(AdminDbContext ctx)
        {
            _dbContext = ctx;
        }

        public async Task<DecisionTree?> GetAsync(int decisionTreeId)
        {
            return await _dbContext.DecisionTrees.Where(dt => dt.DecisionTreeId == decisionTreeId).Include(dt => dt.Items).ThenInclude(i => (i as Question).Choices).FirstOrDefaultAsync();
        }
    }
}
