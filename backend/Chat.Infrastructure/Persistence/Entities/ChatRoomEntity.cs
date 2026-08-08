namespace Chat.Infrastructure.Persistence.Entities;
public class ChatRoomEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public ICollection<ChatMemberEntity> Members { get; set; } = [];
    public ICollection<MessageEntity> Messages { get; set; } = [];
}
