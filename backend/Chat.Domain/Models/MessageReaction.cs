namespace Chat.Domain.Models;
public class MessageReaction
{
    public Guid Id { get; private set; }
    public Guid MessageId { get; private set; }
    public Guid UserId { get; private set; }
    public string Emoji { get; private set; } 
    public DateTimeOffset CreatedAt { get; private set; }

    private MessageReaction(Guid id, Guid messageId, Guid userId, string emoji, DateTimeOffset createdAt) 
    {
        Id = id;
        MessageId = messageId;
        UserId = userId;
        Emoji = emoji;
        CreatedAt = createdAt;   
    }

    public static MessageReaction Create(Guid messageId, Guid userId, string emoji)
    {
        return new MessageReaction(Guid.NewGuid(), messageId, userId, emoji, DateTimeOffset.UtcNow);
    }

    public static MessageReaction Restore(Guid id, Guid messageId, Guid userId, string emoji, DateTimeOffset createdAt)
    {
        return new MessageReaction(id, messageId, userId, emoji, createdAt);
    }
}
