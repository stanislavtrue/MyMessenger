using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IRefreshTokensRepository
{
    Task Add(RefreshToken token);
    Task<RefreshToken?> GetByToken(string token);
    Task<List<RefreshToken>> GetActiveByUserId(Guid userId);
    Task Update(RefreshToken token);
}
