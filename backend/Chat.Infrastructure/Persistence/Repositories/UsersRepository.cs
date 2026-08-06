using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
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
            PasswordHash = user.PasswordHash,
            Email = user.Email
        };

        await _context.Users.AddAsync(userEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<User> GetByEmail(string email)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email) ?? throw new InvalidOperationException("User not found.");

        return User.Create(userEntity.Id, userEntity.Username, userEntity.PasswordHash, userEntity.Email);
    }

    public async Task<User> GetById(Guid id)
    {
        var userEntity = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id) ?? throw new InvalidOperationException("User not found.");

        return User.Create(userEntity.Id, userEntity.Username, userEntity.PasswordHash, userEntity.Email);
    }
}
