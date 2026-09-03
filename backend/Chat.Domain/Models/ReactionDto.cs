namespace Chat.Domain.Models;
public record ReactionDto
(
    string Emoji,
    int Count,
    bool IsOwn
);
