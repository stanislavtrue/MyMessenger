using Chat.Application.DTOs;
using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IMessagesRepository
{
    Task Add(Message message);
    Task<List<Message>> GetByChatId(Guid chatId);
    Task<Message> GetById(Guid messageId);
    Task<DateTimeOffset?> GetSentAtById(Guid messageId);
    Task<List<LastMessageDto>> GetLastMessagesByChatIds(List<Guid> chatIds);
    Task<int> GetUnreadCount(Guid chatId, Guid userId, DateTimeOffset? sentAt);
}
