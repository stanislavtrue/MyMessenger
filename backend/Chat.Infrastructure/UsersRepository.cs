using Chat.Core.Interfaces;
using Chat.Core.Models;

namespace Chat.Infrastructure;
public class UsersRepository : IUsersRepository
{
    public List<User> users = new List<User>();

    public void Add(User user)
    {
        users.Add(user);
    }

    public User GetByEmail(string email)
    {
        foreach (var user in users)
        {
            if (user.Email == email)
                return user;
        }
        return null;
    }
}
