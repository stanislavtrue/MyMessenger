namespace Chat.Domain.Models;
public class User
{
    public Guid Id { get; private set; }
    public string Username { get; private set; }
    public string DisplayName { get; private set; }
    public string? AvatarUrl { get; private set; }
    public DateTimeOffset? LastSeenAt { get; private set; }
    public string PasswordHash { get; private set; }
    public string Email { get; private set ;}

    private User(Guid id, string username, string displayName, string? avatarUrl, DateTimeOffset? lastSeenAt, string passwordHash, string email)
    {
        Id = id;
        Username = username;
        DisplayName = displayName;
        AvatarUrl = avatarUrl;
        LastSeenAt = lastSeenAt;
        PasswordHash = passwordHash;
        Email = email;
    }

    public static User Create(Guid id, string username, string passwordHash, string email)
    {
        return new User(id, username, username, string.Empty, null, passwordHash, email);
    }

    public static User Restore(Guid id, string username, string displayName, string? avatarUrl, DateTimeOffset? lastSeenAt, string passwordHash, string email)
    {
        return new User(id, username, displayName, avatarUrl, lastSeenAt, passwordHash, email);
    }
}
