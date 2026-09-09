namespace Chat.Domain.Models;
public class UserDeletedMessage
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid MessageId { get; private set; }
    public DateTimeOffset DeletedAt { get; private set; }

    private UserDeletedMessage(Guid id, Guid userId, Guid messageId, DateTimeOffset deletedAt)
    {
        Id = id;
        UserId = userId;
        MessageId = messageId;
        DeletedAt = deletedAt;
    }

    public static UserDeletedMessage Create(Guid userId, Guid messageId)
    {
        return new UserDeletedMessage(Guid.NewGuid(), userId, messageId, DateTimeOffset.UtcNow);
    }

    public static UserDeletedMessage Restore(Guid id, Guid userId, Guid messageId, DateTimeOffset deletedAt)
    {
        return new UserDeletedMessage(id, userId, messageId, deletedAt);
    }
}
