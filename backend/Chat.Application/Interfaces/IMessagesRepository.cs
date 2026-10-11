using Chat.Application.DTOs;
using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IMessagesRepository
{
    Task Add(Message message);
    Task<(List<Message> Messages, bool HasMore)> GetPageByChatId(Guid chatId, Guid currentUserId, Guid? beforeMessageId, int pageSize, CancellationToken cancellationToken = default);
    Task<List<Message>> GetByChatId(Guid chatId, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, ReplyMessageDto>> GetReplyPreviews(List<Guid> replyToIds, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Message> GetById(Guid messageId);
    Task<DateTimeOffset?> GetSentAtById(Guid messageId);
    Task<Guid> GetChatIdById(Guid messageId);
    Task<List<LastMessageDto>> GetLastMessagesByChatIds(List<Guid> chatIds, Guid currentUserId, CancellationToken cancellationToken = default);
    Task<Dictionary<Guid, LastMessageDto>> GetLastMessagesByUserIds(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default);
    Task<LastMessageDto?> GetLastMessageByUserId(Guid chatId, Guid userId, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCount(Guid chatId, Guid userId, DateTimeOffset? sentAt);
    Task DeleteForUser(Guid userId, Guid messageId, CancellationToken cancellationToken = default);
    Task DeleteForEveryone(Message message, CancellationToken cancellationToken = default);
}
