using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class refactorChoiceGotoItemIdReference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Subtext",
                table: "Item",
                newName: "SubText");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SubText",
                table: "Item",
                newName: "Subtext");
        }
    }
}
