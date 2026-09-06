using Chat.Domain.Models;

namespace Chat.Application.DTOs;
public record ChatRoomDto
(
    ChatRoom ChatRoom,
    User User,
    string? LastMessage,
    DateTimeOffset? LastMessageAt,
    int UnreadCount
);

