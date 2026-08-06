namespace Chat.Domain.Models;
public class RefreshToken
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Token { get; private set; }
    public DateTimeOffset ExpiresAt { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset? RevokedAt { get; private set; }

    private RefreshToken(Guid id, Guid userId, string token, DateTimeOffset expiresAt, DateTimeOffset createdAt, DateTimeOffset? revokedAt)
    {
        Id = id;
        UserId = userId;
        Token = token;
        ExpiresAt = expiresAt;
        CreatedAt = createdAt;
        RevokedAt = revokedAt;
    }

    public bool IsRevoked => RevokedAt != null;
    public bool IsExpired => ExpiresAt <= DateTimeOffset.UtcNow;
    public bool IsActive => !IsRevoked && !IsExpired;

    public void Revoke()
    {
        if (IsRevoked) return;
        RevokedAt = DateTimeOffset.UtcNow;
    }

    public static RefreshToken Create(Guid userId, string token, DateTimeOffset expiresAt)
    {
        return new RefreshToken(Guid.NewGuid(), userId, token, expiresAt, DateTimeOffset.UtcNow, null);
    }

    public static RefreshToken Restore(Guid id, Guid userId, string token, DateTimeOffset expiresAt, DateTimeOffset createdAt, DateTimeOffset? revokedAt)
    {
        return new RefreshToken(id, userId, token, expiresAt, createdAt, revokedAt);
    }
}
