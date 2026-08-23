namespace Chat.Infrastructure.Persistence.Entities;
public class ChatMemberEntity
{
    public Guid Id { get; set; }
    public Guid ChatId { get; set; }
    public Guid UserId { get; set; }
    public ChatRoomEntity ChatRoom { get; set; } = null!;
    public UserEntity User { get; set; } = null!;
    public Guid? LastReadMessageId { get; set; }
    public int UnreadCount { get; set; } = 0;
}
