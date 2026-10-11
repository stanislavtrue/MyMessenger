using Chat.Application.DTOs;

namespace Chat.Application.DTOs;
public record MessagePageDto
(
    List<MessageDto> Messages,
    bool HasMore,
    Guid? NextCursor
);
