namespace Chat.Application.DTOs;
public record PinnedMessageDto
(
    Guid MessageId,
    Guid ChatId,
    Guid PinnedByUserId,
    string Text,
    DateTimeOffset PinnedAt
);
