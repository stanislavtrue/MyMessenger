namespace Chat.Domain.Models;
public record ChatMemberInfo
(
    Guid ChatId,
    Guid UserId
);
