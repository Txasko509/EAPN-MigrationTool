using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    /// <inheritdoc />
    public partial class refactorGotoItemId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "GotoItemId",
                table: "Choice",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Choice_GotoItemId",
                table: "Choice",
                column: "GotoItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Choice_Item_GotoItemId",
                table: "Choice",
                column: "GotoItemId",
                principalTable: "Item",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choice_Item_GotoItemId",
                table: "Choice");

            migrationBuilder.DropIndex(
                name: "IX_Choice_GotoItemId",
                table: "Choice");

            migrationBuilder.AlterColumn<int>(
                name: "GotoItemId",
                table: "Choice",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
