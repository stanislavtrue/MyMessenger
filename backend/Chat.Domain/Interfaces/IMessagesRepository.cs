using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IMessagesRepository
{
    Task Add(Message message);
    Task<List<Message>> GetByChatId(Guid chatId);
    Task<Message> GetById(Guid messageId);
    Task<DateTimeOffset?> GetSentAtById(Guid messageId);
    Task<int> GetUnreadCount(Guid chatId, Guid? lastReadMessageId);
}
