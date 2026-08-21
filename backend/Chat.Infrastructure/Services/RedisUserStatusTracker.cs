using Chat.Domain.Interfaces;
using StackExchange.Redis;

namespace Chat.Infrastructure.Services;
public class RedisUserStatusTracker : IUserStatusTracker
{
    private readonly IConnectionMultiplexer _redis;
    private IDatabase Database => _redis.GetDatabase();
    
    public RedisUserStatusTracker(IConnectionMultiplexer redis)
    {
        _redis = redis;
    }

    public async Task<bool> AddConnectionAsync(Guid userId, string connectionId)
    {
        var key = GetConnectionsKey(userId);

        var wasOffline = await Database.SetLengthAsync(key) == 0;

        await Database.SetAddAsync(key, connectionId);

        await Database.KeyExpireAsync(key, TimeSpan.FromHours(24));

        return wasOffline;
    }

    public async Task<bool> RemoveConnectionAsync(Guid userId, string connectionId)
    {
        var key = GetConnectionsKey(userId);

        var removed = await Database.SetRemoveAsync(key, connectionId);

        if (!removed)
            return false;
        
        if (await Database.SetLengthAsync(key) == 0)
        {
            await Database.KeyDeleteAsync(key);
            return true;
        }

        return false;
    }

    public async Task<bool> IsUserOnlineAsync(Guid userId)
    {
        var key = GetConnectionsKey(userId);
        return await Database.KeyExistsAsync(key);
    }

    private static string GetConnectionsKey(Guid userId) => $"user:{userId}:connections";
}
