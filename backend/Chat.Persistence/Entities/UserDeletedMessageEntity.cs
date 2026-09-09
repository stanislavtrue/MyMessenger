namespace Chat.Persistence.Entities;
public class UserDeletedMessageEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public UserEntity User { get; set; } = null!;
    public Guid MessageId { get; set; }
    public MessageEntity Message { get; set; } = null!;
    public DateTimeOffset DeletedAt { get; set; }
}
