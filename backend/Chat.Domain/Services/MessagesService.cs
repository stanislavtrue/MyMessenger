using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class MessagesService
{
    private readonly IMessagesRepository _messagesRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MessagesService(IMessagesRepository messagesRepository, IUnitOfWork unitOfWOrk)
    {
        _messagesRepository = messagesRepository;
        _unitOfWork = unitOfWOrk;
    }

    public async Task<Message> Send(Guid chatId, Guid senderId, string text)
    {
        var message = Message.Create(
            chatId,
            senderId,
            text
        );

        await _messagesRepository.Add(message);

        await _unitOfWork.SaveChangesAsync();

        return message;
    }

    public async Task<List<Message>> GetByChatId(Guid chatId)
    {
        return await _messagesRepository.GetByChatId(chatId);
    }
}
