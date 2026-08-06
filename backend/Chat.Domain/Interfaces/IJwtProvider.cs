using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IJwtProvider
{
    string GenerateAccessToken(User user);
    string GenerateRefreshTokenValue();
}
