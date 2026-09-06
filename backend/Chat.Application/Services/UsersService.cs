using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Models;

namespace Chat.Application.Services;
public class UsersService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IRefreshTokensRepository _refreshTokensRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtProvider _jwtProvider;
    private readonly IUnitOfWork _unitOfWork;

    public UsersService(IUsersRepository usersRepository, IRefreshTokensRepository refreshTokensRepository, IPasswordHasher passwordHasher, IJwtProvider jwtProvider, IUnitOfWork unitOfWOrk)
    {
        _usersRepository = usersRepository;
        _refreshTokensRepository = refreshTokensRepository;
        _passwordHasher = passwordHasher;
        _jwtProvider = jwtProvider;
        _unitOfWork = unitOfWOrk;
    }

    public async Task Register(string username, string email, string password)
    {
        var passwordHash = _passwordHasher.Generate(password);

        var user = User.Create(Guid.NewGuid(), username, passwordHash, email);

        await _usersRepository.Add(user);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<LoginResultDto> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);

        var activeRefreshTokens = await _refreshTokensRepository.GetActiveByUserId(user.Id);

        var isValid = _passwordHasher.Verify(password, user.PasswordHash);

        if (isValid == false)
        {
            throw new InvalidCredentialsException("Failed to login");
        }

        foreach(var token in activeRefreshTokens)
        {
            token.Revoke();
            await _refreshTokensRepository.Update(token);
        }

        var accessToken = _jwtProvider.GenerateAccessToken(user);

        var refreshToken = RefreshToken.Create(user.Id, _jwtProvider.GenerateRefreshTokenValue(), DateTimeOffset.UtcNow.AddDays(30));

        await _refreshTokensRepository.Add(refreshToken);

        await _unitOfWork.SaveChangesAsync();

        return new LoginResultDto(accessToken, refreshToken.Token);
    }

    public async Task Logout(Guid userId ,string refreshTokenValue)
    {
        var refreshToken = await _refreshTokensRepository.GetByToken(refreshTokenValue);

        if (refreshToken is null)
            throw new RefreshTokenNotFoundException();
        
        if (userId != refreshToken.UserId)
            throw new InvalidRefreshTokenException();

        refreshToken.Revoke();

        await _refreshTokensRepository.Update(refreshToken);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<LoginResultDto?> Refresh(string refreshTokenValue)
    {
        var refreshToken = await _refreshTokensRepository.GetByToken(refreshTokenValue);

        if (refreshToken is null) 
            return null;

        if(refreshToken.IsExpired)
        {
            refreshToken.Revoke();
            await _refreshTokensRepository.Update(refreshToken);

            await _unitOfWork.SaveChangesAsync();

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

        await _unitOfWork.SaveChangesAsync();

        return new LoginResultDto(accessToken, newRefreshToken.Token);
    }

    public async Task UpdateLastSeen(Guid userId, DateTimeOffset lastSeenAt)
    {
        await _usersRepository.UpdateLastSeen(userId, lastSeenAt);

        await _unitOfWork.SaveChangesAsync();
    }
}
