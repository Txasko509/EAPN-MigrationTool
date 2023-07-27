using Microsoft.AspNetCore.Identity;
using MigrationTool.DecisionTrees.Auth.API.Data;

namespace MigrationTool.DecisionTrees.Auth.API
{
    public static class IdentityDataInitializer
    {
        public static void SeedRoles
(RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.RoleExistsAsync
        (RoleEnum.Admin.ToString()).Result)
            {
                IdentityRole role = new IdentityRole() { Name = RoleEnum.Admin.ToString() };
                var result = roleManager.CreateAsync(role).Result;
            }

            if (!roleManager.RoleExistsAsync
        (RoleEnum.User.ToString()).Result)
            {
                IdentityRole role = new IdentityRole() { Name = RoleEnum.User.ToString() };
                var result = roleManager.CreateAsync(role);
            }
        }

        public static void SeedDefaultUser
(UserManager<ApplicationUser> userManager)
        {
            var user = userManager.FindByEmailAsync("alice@test.es").Result;
            if (user == null)
            {
                var defaultUser = new ApplicationUser
                {
                    FirstName = "Alice",
                    LastName = "GreenWood",
                    UserName = "alice@test.es",
                    Email = "alice@test.es",
                    EmailConfirmed = true
                };

                var result = userManager.CreateAsync(defaultUser, "Pass123.").Result;
                result = userManager.SetLockoutEnabledAsync(defaultUser, false).Result;

                // Add user admin to Role Admin if not already added
                var rolesForUser = userManager.GetRolesAsync(defaultUser).Result;
                if (!rolesForUser.Contains(RoleEnum.Admin.ToString()))
                {
                    userManager.AddToRoleAsync(defaultUser, RoleEnum.Admin.ToString());
                }
            }
        }
    }
}
