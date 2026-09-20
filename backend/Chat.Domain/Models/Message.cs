namespace Chat.Domain.Models;
public class Message
{
    public Guid Id { get; private set; }
    public Guid ChatId { get; private set; }
    public Guid SenderId { get; private set; }
    public string Text { get; private set; }
    public DateTimeOffset SentAt { get; private set; }
    public DateTimeOffset? DeletedAt { get; private set; }
    public bool IsDeleted => DeletedAt.HasValue;
    public Guid? ReplyToMessageId { get; private set; }

    private Message(Guid id, Guid chatId, Guid senderId, string text, DateTimeOffset sentAt, DateTimeOffset? deletedAt, Guid? replyToMessageId)
    {
        Id = id;
        ChatId = chatId;
        SenderId = senderId;
        Text = text;
        SentAt = sentAt;
        DeletedAt = deletedAt;
        ReplyToMessageId = replyToMessageId;
    }

    public void Delete(DateTimeOffset deletedAt)
    {
        if (IsDeleted) 
            return;

        DeletedAt = deletedAt;
    }

    public static Message Create(Guid chatId, Guid senderId, string text, Guid? replyToMessageId = null)
    {
        return new Message(Guid.NewGuid(), chatId, senderId, text, DateTimeOffset.UtcNow, null, replyToMessageId);
    }

    public static Message Restore(Guid id, Guid chatId, Guid senderId, string text, DateTimeOffset sentAt, DateTimeOffset? deletedAt, Guid? replyToMessageId)
    {
        return new Message(id, chatId, senderId, text, sentAt, deletedAt, replyToMessageId);
    }
}
