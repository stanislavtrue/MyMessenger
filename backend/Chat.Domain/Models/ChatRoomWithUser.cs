namespace Chat.Domain.Models;
public record ChatRoomWithUser
(
    ChatRoom ChatRoom,
    User User
);

