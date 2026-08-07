using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class UsersService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;

    public UsersService(IUsersRepository usersRepository, IRefreshTokensRepository refreshTokensRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
    {
        _usersRepository = usersRepository;
        _refreshTokensRepository = refreshTokensRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
    }

    public async Task Register(string username, string email, string password)
    {
        var passwordHash = _passwordHasher.Generate(password);

        var user = User.Create(Guid.NewGuid(), username, passwordHash, email);

        await _usersRepository.Add(user);
    }

    public async Task<LoginResult> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);

        var isValid = _passwordHasher.Verify(password, user.PasswordHash);

        if (isValid == false)
        {
            throw new Exception("Failed to login");
        }

        var accessToken = _jwtProvider.GenerateAccessToken(user);

        var refreshToken = RefreshToken.Create(user.Id, _jwtProvider.GenerateRefreshTokenValue(), DateTimeOffset.UtcNow.AddDays(30));

        await _refreshTokensRepository.Add(refreshToken);

        return new LoginResult(accessToken, refreshToken.Token);
    }

    public async Task Logout(Guid userId ,string refreshTokenValue)
    {
        var refreshToken = await _refreshTokensRepository.GetByToken(refreshTokenValue);

        if (refreshToken is null)
            throw new InvalidOperationException("Token not found");
        
        if (userId != refreshToken.UserId)
            throw new InvalidOperationException("Invalid refresh token");

        refreshToken.Revoke();
        
        await _refreshTokensRepository.Update(refreshToken);
    }

    public async Task<LoginResult?> Refresh(string refreshTokenValue)
    {
        var refreshToken = await _refreshTokensRepository.GetByToken(refreshTokenValue);

        if (refreshToken is null) 
            return null;

        if(refreshToken.IsExpired)
        {
            refreshToken.Revoke();
            await _refreshTokensRepository.Update(refreshToken);
            return null;
        }

        if (!refreshToken.IsActive)
            return null;

        var user = await _usersRepository.GetById(refreshToken.UserId);
        
        var accessToken = _jwtProvider.GenerateAccessToken(user);

        var newRefreshToken = RefreshToken.Create(
            refreshToken.UserId,
             _jwtProvider.GenerateRefreshTokenValue(),
            DateTimeOffset.UtcNow.AddDays(30));

        refreshToken.Revoke();

        await _refreshTokensRepository.Update(refreshToken);

        await _refreshTokensRepository.Add(newRefreshToken);

        return new LoginResult(accessToken, newRefreshToken.Token);
    }
}
