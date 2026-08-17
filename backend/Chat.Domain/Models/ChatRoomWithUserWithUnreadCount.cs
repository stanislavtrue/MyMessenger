namespace Chat.Domain.Models;
public record ChatRoomWithUserWithUnreadCount
(
    ChatRoom ChatRoom,
    User User,
    int UnreadCount
);

