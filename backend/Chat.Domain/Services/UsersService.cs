using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class UsersService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public UsersService(IUsersRepository usersRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task Register(string username, string email, string password)
    {
        var passwordHash = _passwordHasher.Generate(password);
        var user = User.Create(Guid.NewGuid(), username, passwordHash, email);
        await _usersRepository.Add(user);
    }

    public async Task<string> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);
        var result = _passwordHasher.Verify(password, user.PasswordHash);
        if (result == false)
        {
            throw new Exception("Failed to login");
        }
        var token = _jwtProvider.GenerateToken(user);
        
        return token;
    }
}
