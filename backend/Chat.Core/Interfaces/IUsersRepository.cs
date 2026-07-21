using Chat.Core.Models;

namespace Chat.Core.Interfaces;
public interface IUsersRepository
{
    void Add(User user);
    User GetByEmail(string email);
}
