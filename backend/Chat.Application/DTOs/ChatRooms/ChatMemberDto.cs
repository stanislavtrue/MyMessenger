namespace Chat.Application.DTOs;
public record ChatMemberDto
(
    Guid ChatId,
    Guid UserId
);
