namespace Chat.Domain.Models;
public class ChatMember
{
    public Guid Id { get; private set; }
    public Guid ChatId { get; private set; }
    public Guid UserId { get; private set; }

    private ChatMember(Guid id, Guid chatId, Guid userId)
    {
        Id = id;
        ChatId = chatId;
        UserId = userId;
    }

    public static ChatMember Create(Guid chatId, Guid userId)
    {
        return new ChatMember(Guid.NewGuid(), chatId, userId);
    }

    public static ChatMember Restore(Guid id, Guid chatId, Guid userId)
    {
        return new ChatMember(id, chatId, userId);
    }
}
