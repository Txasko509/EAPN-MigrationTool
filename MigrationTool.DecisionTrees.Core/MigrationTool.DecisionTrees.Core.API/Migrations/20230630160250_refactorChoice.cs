using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class refactorChoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choice_Question_ItemId",
                table: "Choice");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "Choice",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Choice_Question_ItemId",
                table: "Choice",
                column: "ItemId",
                principalTable: "Question",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choice_Question_ItemId",
                table: "Choice");

            migrationBuilder.AlterColumn<int>(
                name: "ItemId",
                table: "Choice",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Choice_Question_ItemId",
                table: "Choice",
                column: "ItemId",
                principalTable: "Question",
                principalColumn: "ItemId");
        }
    }
}
