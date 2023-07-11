using EnumStringValues;

namespace MigrationTool.DecisionTrees.Core.Repositories.Model
{
    public enum ItemTypeEnum
    {
        [StringValue("01")]
        Question,

        [StringValue("02")]
        Answer
    }
}
