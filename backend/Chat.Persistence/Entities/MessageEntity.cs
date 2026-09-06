namespace Chat.Persistence.Entities;
public class MessageEntity
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public Guid SenderId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTimeOffset SentAt { get; set; }
    public List<MessageReactionEntity> Reactions { get; set; } = new();
}
