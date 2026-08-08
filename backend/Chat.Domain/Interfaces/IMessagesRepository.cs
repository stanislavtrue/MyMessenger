using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IMessagesRepository
{
    Task Add(Message message);
    Task<List<Message>> GetByChatId(Guid chatId);
}
