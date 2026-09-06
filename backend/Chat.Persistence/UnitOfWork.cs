using Chat.Application.Interfaces;

namespace Chat.Persistence;
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
