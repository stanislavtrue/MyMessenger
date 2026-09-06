using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IUsersRepository
{
    Task Add(User user);
    Task<User> GetByEmail(string email);
    Task<User> GetById(Guid id);
    Task<List<User>> GetByIds(List<Guid> ids);
    Task UpdateLastSeen(Guid userId, DateTimeOffset lastSeenAt);
}
