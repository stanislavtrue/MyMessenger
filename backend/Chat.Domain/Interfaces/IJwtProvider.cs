using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IJwtProvider
{
    string GenerateToken(User user);
}
