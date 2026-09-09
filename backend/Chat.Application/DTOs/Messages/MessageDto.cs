using Chat.Domain.Enums;

namespace Chat.Application.DTOs;
public record MessageDto
(
    Guid Id,
    Guid ChatId,
    Guid SenderId,
    string Text,
    DateTimeOffset SentAt,
    bool IsDeleted,
    MessageStatus Status,
    List<ReactionDto> Reactions
);
