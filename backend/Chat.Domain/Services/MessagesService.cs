using Chat.Domain.Enums;
using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class MessagesService
{
    private readonly IMessagesRepository _messagesRepository;
    private readonly IChatMembersRepository _chatMemberRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MessagesService(IMessagesRepository messagesRepository, IChatMembersRepository chatMembersRepository, IUnitOfWork unitOfWOrk)
    {
        _messagesRepository = messagesRepository;
        _chatMemberRepository = chatMembersRepository;
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

    public async Task<Message> GetById(Guid messageId)
    {
        return await _messagesRepository.GetById(messageId);
    }

    public async Task<List<MessageDto>> GetByChatId(Guid currentUserId, Guid chatId)
    {
        var messages = await _messagesRepository.GetByChatId(chatId);

    var recipientLastReadMessageId = await _chatMemberRepository.GetLastReadMessageId(chatId, currentUserId);

        DateTimeOffset? recipientLastReadMessageSentAt = null;

        if (recipientLastReadMessageId.HasValue)
        {
            recipientLastReadMessageSentAt = messages.FirstOrDefault(m => m.Id == recipientLastReadMessageId.Value)?.SentAt;

            if (recipientLastReadMessageSentAt is null)
                recipientLastReadMessageSentAt = await _messagesRepository.GetSentAtById(recipientLastReadMessageId.Value);
        }

        return messages.Select(m => new MessageDto
        (
            m.Id,
            m.ChatId,
            m.SenderId,
            m.Text,
            m.SentAt,
            CalculateMessageStatus(m, currentUserId, recipientLastReadMessageSentAt)
        )).ToList();
    }

    private MessageStatus CalculateMessageStatus(Message message, Guid currentUserId, DateTimeOffset? recipientLastReadMessageSentAt)
    {
        if (message.SenderId != currentUserId)
            return MessageStatus.Read;

        if (recipientLastReadMessageSentAt is null) 
            return MessageStatus.Sent;

        return message.SentAt <= recipientLastReadMessageSentAt.Value 
            ? MessageStatus.Read 
            : MessageStatus.Sent;
    }
}
