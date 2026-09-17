namespace Chat.Persistence.Entities;
public class PinnedMessageEntity
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public MessageEntity Message { get; set; } = null!;
    public Guid PinnedByUserId { get; set; }
    public UserEntity PinnedByUser { get; set; } = null!;
    public DateTimeOffset PinnedAt { get; set; }
}
