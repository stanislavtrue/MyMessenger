using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence;
public class ChatDbContext : DbContext
{
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public ChatDbContext(DbContextOptions<ChatDbContext> opitons) : base(opitons)
    {
    }
}
