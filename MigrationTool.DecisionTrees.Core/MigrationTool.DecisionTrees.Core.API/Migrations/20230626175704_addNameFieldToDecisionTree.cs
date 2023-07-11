using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class addNameFieldToDecisionTree : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "DecisionTree",
                type: "nvarchar(250)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "DecisionTree",
                type: "nvarchar(150)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "DecisionTree");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "DecisionTree",
                type: "nvarchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldNullable: true);
        }
    }
}
