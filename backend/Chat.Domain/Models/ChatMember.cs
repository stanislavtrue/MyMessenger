namespace Chat.Domain.Models;
public class ChatMember
{
    public Guid Id { get; private set; }
    public Guid ChatId { get; private set; }
    public Guid UserId { get; private set; }
    public Guid? LastReadMessageId { get; private set; }

    private ChatMember(Guid id, Guid chatId, Guid userId, Guid? lastReadMessageId)
    {
        Id = id;
        ChatId = chatId;
        UserId = userId;
        LastReadMessageId = lastReadMessageId;
    }

    public static ChatMember Create(Guid chatId, Guid userId)
    {
        return new ChatMember(Guid.NewGuid(), chatId, userId, null);
    }

    public static ChatMember Restore(Guid id, Guid chatId, Guid userId, Guid? lastReadMessageId)
    {
        return new ChatMember(id, chatId, userId, lastReadMessageId);
    }

    public void MarkAsRead(Guid messageId)
    {
        LastReadMessageId = messageId;
    }
}
