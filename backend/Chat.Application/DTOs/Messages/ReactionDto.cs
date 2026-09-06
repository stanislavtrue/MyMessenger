namespace Chat.Application.DTOs;
public record ReactionDto
(
    string Emoji,
    int Count,
    bool IsOwn
);
