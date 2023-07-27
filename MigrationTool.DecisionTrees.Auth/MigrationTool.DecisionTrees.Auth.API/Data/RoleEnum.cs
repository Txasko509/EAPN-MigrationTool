using EnumStringValues;

namespace MigrationTool.DecisionTrees.Auth.API.Data
{
    public enum RoleEnum
    {
        [StringValue("01")]
        Admin,

        [StringValue("02")]
        User
    }
}
