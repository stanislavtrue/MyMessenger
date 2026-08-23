namespace Chat.Domain.Models;
public class ChatMember
{
    public Guid Id { get; private set; }
    public Guid ChatId { get; private set; }
    public Guid UserId { get; private set; }
    public Guid? LastReadMessageId { get; private set; }
    public int UnreadCount { get; private set; } = 0;

    private ChatMember(Guid id, Guid chatId, Guid userId, Guid? lastReadMessageId, int unreadCount)
    {
        Id = id;
        ChatId = chatId;
        UserId = userId;
        LastReadMessageId = lastReadMessageId;
        UnreadCount = unreadCount;
    }

    public static ChatMember Create(Guid chatId, Guid userId)
    {
        return new ChatMember(Guid.NewGuid(), chatId, userId, null, 0);
    }

    public static ChatMember Restore(Guid id, Guid chatId, Guid userId, Guid? lastReadMessageId, int unreadCount)
    {
        return new ChatMember(id, chatId, userId, lastReadMessageId, unreadCount);
    }

    public void MarkAsRead(Guid messageId)
    {
        LastReadMessageId = messageId;
    }
}
