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

    private Message(Guid id, Guid chatId, Guid senderId, string text, DateTimeOffset sentAt, DateTimeOffset? deletedAt)
    {
        Id = id;
        ChatId = chatId;
        SenderId = senderId;
        Text = text;
        SentAt = sentAt;
        DeletedAt = deletedAt;
    }

    public void Delete(DateTimeOffset deletedAt)
    {
        if (IsDeleted) 
            return;

        DeletedAt = deletedAt;
    }

    public static Message Create(Guid chatId, Guid senderId, string text)
    {
        return new Message(Guid.NewGuid(), chatId, senderId, text, DateTimeOffset.UtcNow, null);
    }

    public static Message Restore(Guid id, Guid chatId, Guid senderId, string text, DateTimeOffset sentAt, DateTimeOffset? deletedAt)
    {
        return new Message(id, chatId, senderId, text, sentAt, deletedAt);
    }
}
