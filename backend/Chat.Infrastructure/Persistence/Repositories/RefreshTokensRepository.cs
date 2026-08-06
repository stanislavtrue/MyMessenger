using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
public class RefreshTokensRepository : IRefreshTokensRepository
{
    private readonly ChatDbContext _context;
    public RefreshTokensRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(RefreshToken token)
    {
        var refreshTokenEntity = new RefreshTokenEntity
        {
            Id = token.Id,
            UserId = token.UserId,
            Token = token.Token,
            ExpiresAt = token.ExpiresAt,
            CreatedAt = token.CreatedAt,
            RevokedAt = token.RevokedAt
        };

        await _context.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<RefreshToken?> GetByToken(string token)
    {
        var refreshTokenEntity = await _context.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(rt => rt.Token == token) ?? throw new InvalidOperationException("Token not found");

        return RefreshToken.Restore(
            refreshTokenEntity.Id, 
            refreshTokenEntity.UserId, 
            refreshTokenEntity.Token, 
            refreshTokenEntity.ExpiresAt,
            refreshTokenEntity.CreatedAt,
            refreshTokenEntity.RevokedAt);
    }

    public async Task Update(RefreshToken token)
    {
        var refreshTokenEntity = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Id == token.Id) ?? throw new InvalidOperationException("Token not found");

        refreshTokenEntity.RevokedAt = token.RevokedAt;

        await _context.SaveChangesAsync();
    }
}
