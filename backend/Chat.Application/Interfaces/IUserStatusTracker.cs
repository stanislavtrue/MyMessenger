namespace Chat.Application.Interfaces;
public interface IUserStatusTracker
{
    Task<bool> AddConnectionAsync(Guid userId, string connectionId);
    Task<bool> RemoveConnectionAsync(Guid userId, string connectionId);
    Task<bool> IsUserOnlineAsync(Guid userId);
}
