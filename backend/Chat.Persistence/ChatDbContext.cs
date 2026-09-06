using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Persistence;
public class ChatDbContext : DbContext
{
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<MessageEntity> Messages => Set<MessageEntity>();
    public DbSet<ChatRoomEntity> ChatRooms => Set<ChatRoomEntity>();
    public DbSet<ChatMemberEntity> ChatMembers => Set<ChatMemberEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>(); 
    public DbSet<MessageReactionEntity> MessageReactions => Set<MessageReactionEntity>();
    public ChatDbContext(DbContextOptions<ChatDbContext> opitons) : base(opitons)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ChatDbContext).Assembly);
    }
}
