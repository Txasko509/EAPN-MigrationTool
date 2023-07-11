using AspNetCore.IQueryable.Extensions.Pagination;
using AspNetCore.IQueryable.Extensions.Sort;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using MigrationTool.DecisionTrees.Core.Repositories.Context;
using MigrationTool.DecisionTrees.Core.Repositories.Contracts;
using MigrationTool.DecisionTrees.Core.Repositories.Model;
using System.Linq.Dynamic.Core;
using System.Reflection.Metadata;

namespace MigrationTool.DecisionTrees.Core.Repositories
{
    public class DecisionTreeRepository : IDecisionTreeRepository
    {
        private readonly AdminDbContext _dbContext;

        public DecisionTreeRepository(AdminDbContext ctx)
        {
            _dbContext = ctx;
        }

        public async Task<IEnumerable<DecisionTree>> SearchByPropertiesAsync(DateTime? fromDate, DateTime? toDate, string? query, IQuerySort sort, IQueryPaging paging)
        {
            IQueryable<DecisionTree> source = _dbContext.DecisionTrees.AsQueryable().AsNoTracking();

            source = AppendFilters(source, fromDate, toDate, query);

            if (!String.IsNullOrEmpty(sort.Sort))
            {
                source = source.OrderBy(sort.Sort);

            }
            else
            {
                source = source.OrderByDescending(d => d.Date);
            }

            IEnumerable<DecisionTree> decisionTrees = await source.AsSplitQuery()
                                       .ToListAsync();

            return decisionTrees;
        }

        public async Task<DecisionTree?> GetAsync(int decisionTreeId)
        {
            var decisionTree = await _dbContext.DecisionTrees.Where(dt => dt.DecisionTreeId == decisionTreeId).Include(dt => dt.Items).
                ThenInclude(i => (i as Question).Choices).FirstOrDefaultAsync();

            if(decisionTree != null)
            {
                decisionTree.Items = decisionTree?.Items?.OrderBy(i => i.Order).ToList();
            }            

            return decisionTree;
        }

        public async Task<DecisionTree> CreateAsync(DecisionTree decisionTree)
        {
            decisionTree.Date = DateTime.Now.ToUniversalTime();

            foreach (var item in decisionTree.Items.OrderByDescending(i => i.Order))
            {
                if(item is Question)
                {
                    foreach (var choice in ((Question)item).Choices)
                    {
                        if(choice.GotoItem != null)
                        {
                            var reference = decisionTree.Items.Where(i => i.Order == choice.GotoItem.Order).First();
                            choice.GotoItem = _dbContext.Items.Attach(reference).Entity;
                        }
                    }
                }
            }

            _dbContext.DecisionTrees.Add(decisionTree);

            await _dbContext.SaveChangesAsync();

            return decisionTree;
        }

        public async Task<bool> UpdateAsync(int decisionTreeId, DecisionTree decisionTree)
        {
            var decisionTreeToUpdate = await _dbContext.DecisionTrees.Where(d => d.DecisionTreeId == decisionTreeId).Include(d => d.Items).ThenInclude(i => (i as Question).Choices).FirstOrDefaultAsync<DecisionTree>();

            if (decisionTreeToUpdate != null)
            {
                decisionTreeToUpdate.Name = decisionTree.Name;

                // Removed items
                var removedItems = decisionTreeToUpdate.Items.Where(i => decisionTree.Items.All(i2 => i2.ItemId != i.ItemId)).ToList();

                foreach (var removedItem in removedItems)
                {
                    decisionTreeToUpdate.Items.Remove(removedItem);
                }

                var itemRange = new List<Item>();
                foreach (var item in decisionTree.Items)
                {
                    var existingItem = decisionTreeToUpdate.Items
                        .FirstOrDefault(i => i.ItemId == item.ItemId);

                    if (existingItem == null)
                    {
                        itemRange.Add(item);                        

                        if (item is Question)
                        {
                            SetChoices((Question)item, decisionTree.Items);
                        }
                    }
                    else
                    {
                        _dbContext.Entry(existingItem).CurrentValues.SetValues(item);

                        if (existingItem is Question && item is Question)
                        {
                            SetChoices((Question)existingItem, (Question)item, decisionTree.Items);
                        }
                    }
                }

                decisionTreeToUpdate.Items.AddRange(itemRange);

                await _dbContext.SaveChangesAsync();

                return true;
            }

            throw new Exception("Not found DecisionTree with id: " + decisionTreeId);
        }

        public async Task<bool> RemoveAsync(int decisionTreeId)
        {
            var decisionTree = await _dbContext.DecisionTrees.Where(d => d.DecisionTreeId == decisionTreeId).FirstOrDefaultAsync();

            if (decisionTree == null)
            {
                return false;
            }

            _dbContext.DecisionTrees.Remove(decisionTree);

            await _dbContext.SaveChangesAsync();

            return true;
        }

        private static IQueryable<DecisionTree> AppendFilters(IQueryable<DecisionTree> query, DateTime? fromDate, DateTime? toDate,
           string? searchText)
        {
            // From and To date filter
            query = query.Where(d => (d.Date >= (fromDate ?? d.Date) && d.Date <= (toDate ?? d.Date)));

            // Search text filter
            if (!string.IsNullOrWhiteSpace(searchText))
                query = query.Where(d =>
                d.Name.Contains(!string.IsNullOrEmpty(searchText) ? searchText : ""));

            return query;
        }

        private void SetChoices(Question item, List<Item> allItems)
        {
            foreach (var choice in item.Choices)
            {
                if (choice.GotoItem != null && choice.GotoItem.ItemId != 0)
                {
                    choice.GotoItem = _dbContext.Items.Where(i => i.ItemId == choice.GotoItem.ItemId).FirstOrDefault();
                }
                else if (choice.GotoItem != null && choice.GotoItem.ItemId == 0)
                {
                    var reference = allItems.Where(i => i.Order == choice.GotoItem.Order).First();
                    choice.GotoItem = _dbContext.Items.Attach(reference).Entity;
                }
            }
        }

        private void SetChoices(Question itemToUpdate, Question item, List<Item> allItems)
        {
            // Removed choices
            var removedChoices = itemToUpdate.Choices.Where(c => item.Choices.All(c2 => c2.ChoiceId != 0 && c2.ChoiceId != c.ChoiceId)).ToList();

            foreach (var removedChoice in removedChoices)
            {
                itemToUpdate.Choices.Remove(removedChoice);
            }

            var choiceRange = new List<Choice>();
            foreach (var choice in item.Choices)
            {
                var existingChoice = itemToUpdate.Choices
                    .FirstOrDefault(c => c.ChoiceId == choice.ChoiceId);

                if (choice.GotoItem != null && choice.GotoItem.ItemId != 0)
                {
                    choice.GotoItem = _dbContext.Items.Where(i => i.ItemId == choice.GotoItem.ItemId).FirstOrDefault();
                }
                else if (choice.GotoItem != null && choice.GotoItem.ItemId == 0)
                {
                    var reference = allItems.Where(i => i.Order == choice.GotoItem.Order).First();
                    choice.GotoItem = _dbContext.Items.Attach(reference).Entity;
                }

                if (existingChoice == null)
                {
                    choiceRange.Add(choice);                    
                }
                else
                {                   
                    //_dbContext.Entry(existingChoice).CurrentValues.SetValues(choice);

                    existingChoice.GotoItem = choice.GotoItem;
                    existingChoice.Text = choice.Text;
                    existingChoice.Order = choice.Order;
                }
            }

            itemToUpdate.Choices.AddRange(choiceRange);
        }       
    }
}
