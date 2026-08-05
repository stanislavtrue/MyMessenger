namespace Chat.Domain.Models;
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set ;}

    private User(Guid id, string username, string passwordHash, string email)
    {
        Id = id;
        Username = username;
        PasswordHash = passwordHash;
        Email = email;
    }

    public static User Create(Guid id, string username, string passwordHash, string email)
    {
        return new User(id, username, passwordHash, email);
    }
}
