using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshTokenValue();
}
