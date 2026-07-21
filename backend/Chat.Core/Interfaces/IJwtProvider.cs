using Chat.Core.Models;

namespace Chat.Core.Interfaces;
public interface IJwtProvider
{
    string GenerateToken(User user);
}
