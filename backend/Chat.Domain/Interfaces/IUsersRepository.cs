using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IUsersRepository
{
    Task Add(User user);
    Task<User> GetByEmail(string email);
    Task<User> GetById(Guid id);
}
