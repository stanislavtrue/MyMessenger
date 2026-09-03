using Chat.Domain.Enums;

namespace Chat.Domain.Models;
public record MessageDto
(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Text,
    DateTimeOffset SentAt,
    MessageStatus Status,
    List<ReactionDto> Reactions
);
