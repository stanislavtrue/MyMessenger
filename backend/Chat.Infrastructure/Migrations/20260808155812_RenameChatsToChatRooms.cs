using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameChatsToChatRooms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMembers_Chats_ChatId",
                table: "ChatMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Chats_ChatRoomEntityId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Chats",
                table: "Chats");

            migrationBuilder.RenameTable(
                name: "Chats",
                newName: "ChatRooms");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChatRooms",
                table: "ChatRooms",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMembers_ChatRooms_ChatId",
                table: "ChatMembers",
                column: "ChatId",
                principalTable: "ChatRooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_ChatRooms_ChatRoomEntityId",
                table: "Messages",
                column: "ChatRoomEntityId",
                principalTable: "ChatRooms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMembers_ChatRooms_ChatId",
                table: "ChatMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_ChatRooms_ChatRoomEntityId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChatRooms",
                table: "ChatRooms");

            migrationBuilder.RenameTable(
                name: "ChatRooms",
                newName: "Chats");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Chats",
                table: "Chats",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMembers_Chats_ChatId",
                table: "ChatMembers",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Chats_ChatRoomEntityId",
                table: "Messages",
                column: "ChatRoomEntityId",
                principalTable: "Chats",
                principalColumn: "Id");
        }
    }
}
