namespace Chat.Application.DTOs;
public record ReplyMessageDto(
    Guid Id,
    string SenderName,
    string Text,
    bool IsDeleted
);
