using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameMessageReactionsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactionEntity_Messages_MessageId",
                table: "MessageReactionEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactionEntity_Users_UserId",
                table: "MessageReactionEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReactionEntity",
                table: "MessageReactionEntity");

            migrationBuilder.RenameTable(
                name: "MessageReactionEntity",
                newName: "MessageReactions");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReactionEntity_UserId",
                table: "MessageReactions",
                newName: "IX_MessageReactions_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReactionEntity_MessageId_UserId",
                table: "MessageReactions",
                newName: "IX_MessageReactions_MessageId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReactions",
                table: "MessageReactions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactions_Messages_MessageId",
                table: "MessageReactions",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactions_Users_UserId",
                table: "MessageReactions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactions_Messages_MessageId",
                table: "MessageReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReactions_Users_UserId",
                table: "MessageReactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReactions",
                table: "MessageReactions");

            migrationBuilder.RenameTable(
                name: "MessageReactions",
                newName: "MessageReactionEntity");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReactions_UserId",
                table: "MessageReactionEntity",
                newName: "IX_MessageReactionEntity_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReactions_MessageId_UserId",
                table: "MessageReactionEntity",
                newName: "IX_MessageReactionEntity_MessageId_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReactionEntity",
                table: "MessageReactionEntity",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactionEntity_Messages_MessageId",
                table: "MessageReactionEntity",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReactionEntity_Users_UserId",
                table: "MessageReactionEntity",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
