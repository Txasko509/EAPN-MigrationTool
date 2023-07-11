using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class updateFieldsSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Item",
                type: "nvarchar(2000)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(750)");

            migrationBuilder.AlterColumn<string>(
                name: "TextLink",
                table: "Answer",
                type: "nvarchar(200)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Info",
                table: "Answer",
                type: "nvarchar(150)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Item",
                type: "nvarchar(750)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(2000)");

            migrationBuilder.AlterColumn<string>(
                name: "TextLink",
                table: "Answer",
                type: "nvarchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Info",
                table: "Answer",
                type: "nvarchar(1000)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldNullable: true);
        }
    }
}
