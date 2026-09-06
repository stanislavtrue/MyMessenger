namespace Chat.Application.DTOs;
public record LastMessageDto
(
    Guid ChatId,
    string? Text,
    DateTimeOffset? SentAt
);
