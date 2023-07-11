using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSubTextItemField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Subtext",
                table: "Item",
                type: "nvarchar(2000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Subtext",
                table: "Item",
                type: "nvarchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)",
                oldNullable: true);
        }
    }
}
