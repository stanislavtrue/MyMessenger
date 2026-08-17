namespace Chat.Infrastructure.Persistence.Entities;
public class UserEntity
{
    public Guid Id { get; set; }
    public ICollection<RefreshTokenEntity> RefreshTokens { get; set; } = [];
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ICollection<ChatMemberEntity> ChatMembers { get; set; } = [];
}
