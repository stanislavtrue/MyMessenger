using Chat.Application.Interfaces;
using Chat.Domain.Models;
using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Persistence.Repositories;
public class UsersRepository : IUsersRepository
{
    private readonly ChatDbContext _context;

    public UsersRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(User user)
    {
        var userEntity = new UserEntity()
        {
            Id = user.Id,
            Username = user.Username,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            LastSeenAt = user.LastSeenAt,
            PasswordHash = user.PasswordHash,
            Email = user.Email
        };

        await _context.Users.AddAsync(userEntity);
    }

    public async Task<User> GetByEmail(string email)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email) ?? throw new InvalidCredentialsException();

        return User.Restore(userEntity.Id, userEntity.Username, userEntity.DisplayName, userEntity.AvatarUrl, userEntity.LastSeenAt, userEntity.PasswordHash, userEntity.Email);
    }

    public async Task<User> GetById(Guid id)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id) ?? throw new UserNotFoundException();

        return User.Restore(userEntity.Id, userEntity.Username, userEntity.DisplayName, userEntity.AvatarUrl, userEntity.LastSeenAt, userEntity.PasswordHash, userEntity.Email);
    }

    public async Task<List<User>> GetByIds(List<Guid> ids)
    {
        var userEntities = await _context.Users
            .AsNoTracking()
            .Where(u => ids.Contains(u.Id))
            .ToListAsync();

        var users = new List<User>();

        foreach(var userEntity in userEntities)
        {
            users.Add(User.Restore(userEntity.Id, userEntity.Username, userEntity.DisplayName, userEntity.AvatarUrl, userEntity.LastSeenAt, userEntity.PasswordHash, userEntity.Email));
        }

        return users;
    }

    public async Task UpdateLastSeen(Guid userId, DateTimeOffset lastSeenAt)
    {
        await _context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.LastSeenAt, lastSeenAt));
    }
}
