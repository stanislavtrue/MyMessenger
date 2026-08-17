using Chat.Domain.Enums;

namespace Chat.API.DTOs;
public record MessageResponse
(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Text,
    DateTimeOffset SentAt,
    MessageStatus Status
);
