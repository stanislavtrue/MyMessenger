namespace Chat.Domain.Models;
public record LastMessageDto
(
    Guid ChatId,
    string? Text,
    DateTimeOffset? SentAt
);
