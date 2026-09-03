namespace Chat.Infrastructure.Persistence.Entities;
public class MessageReactionEntity
{
    public Guid Id { get; set; }
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }
    public string Emoji { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public MessageEntity Message { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
}
