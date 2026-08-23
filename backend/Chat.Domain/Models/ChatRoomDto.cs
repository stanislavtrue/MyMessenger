namespace Chat.Domain.Models;
public record ChatRoomDto
(
    ChatRoom ChatRoom,
    User User,
    string? LastMessage,
    DateTimeOffset? LastMessageAt,
    int UnreadCount
);

