using Chat.Domain.Interfaces;

namespace Chat.Infrastructure.Persistence;
public class UnitOfWork : IUnitOfWork
{
    private readonly ChatDbContext _context;

    public UnitOfWork(ChatDbContext context)
    {
        _context = context;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
