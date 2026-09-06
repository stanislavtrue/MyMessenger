namespace Chat.API.Responses;
public record class ChatRoomResponse
(
    Guid Id,
    string Name,
    DateTimeOffset CreatedAt,
    UserResponse? User,
    string? LastMessage,
    DateTimeOffset? LastMessageAt,
    int UnreadCount
);
