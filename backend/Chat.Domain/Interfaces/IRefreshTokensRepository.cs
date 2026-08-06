using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IRefreshTokensRepository
{
    Task Add(RefreshToken token);
    Task<RefreshToken?> GetByToken(string token);
    Task Update(RefreshToken token);
}
