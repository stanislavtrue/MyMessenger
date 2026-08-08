namespace Chat.Domain.Models;
public class ChatRoom
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    private ChatRoom(Guid id, string name, DateTimeOffset createdAt)
    {
        Id = id;
        Name = name;
        CreatedAt = createdAt;
    }

    public static ChatRoom Create(string name)
    {
        return new ChatRoom(Guid.NewGuid(), name, DateTimeOffset.UtcNow);
    }

    public static ChatRoom Restore(Guid id, string name, DateTimeOffset createdAt)
    {
        return new ChatRoom(id, name, createdAt);
    }
}
