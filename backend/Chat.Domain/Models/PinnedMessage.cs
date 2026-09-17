namespace Chat.Domain.Models;
public class PinnedMessage
{
    public Guid Id { get; private set; }
    public Guid MessageId { get; private set; }
    public Guid PinnedByUserId { get; private set; }
    public DateTimeOffset PinnedAt { get; private set; }

    private PinnedMessage(Guid id, Guid messageId, Guid pinnedByUserId, DateTimeOffset pinnedAt)
    {
        Id = id;
        MessageId = messageId;
        PinnedByUserId = pinnedByUserId;
        PinnedAt = pinnedAt;
    }

    public static PinnedMessage Create(Guid messageId, Guid pinnedByUserId)
    {
        return new PinnedMessage(Guid.NewGuid(), messageId, pinnedByUserId, DateTimeOffset.UtcNow);
    }

    public static PinnedMessage Restore(Guid id, Guid messageId, Guid pinnedByUserId, DateTimeOffset pinnedAt)
    {
        return new PinnedMessage(id, messageId, pinnedByUserId, pinnedAt);
    }
}
