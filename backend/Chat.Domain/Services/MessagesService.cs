using Chat.Domain.Enums;
using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class MessagesService
{
    private readonly IMessagesRepository _messagesRepository;
    private readonly IChatMembersRepository _chatMemberRepository;
    private readonly IMessageReactionsRepository _messageReactionsRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MessagesService(IMessagesRepository messagesRepository, IChatMembersRepository chatMembersRepository, IMessageReactionsRepository messageReactionsRepository, IUnitOfWork unitOfWOrk)
    {
        _messagesRepository = messagesRepository;
        _chatMemberRepository = chatMembersRepository;
        _messageReactionsRepository = messageReactionsRepository;
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

        await _chatMemberRepository.MarkAsRead(chatId, senderId, message.Id, unreadCount: 0);

        await _chatMemberRepository.IncrementUnreadCount(chatId, senderId);

        return message;
    }

    public async Task<Message> GetById(Guid messageId)
    {
        return await _messagesRepository.GetById(messageId);
    }

    public async Task<List<MessageDto>> GetByChatId(Guid currentUserId, Guid chatId)
    {
        var messages = await _messagesRepository.GetByChatId(chatId);

        var messageIds = messages.Select(m => m.Id).ToList();

        var reactions = await _messageReactionsRepository.GetByMessageIds(messageIds);

        var reactionsByMessage = reactions
            .GroupBy(mr => mr.MessageId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var recipientLastReadMessageId = await _chatMemberRepository.GetLastReadMessageId(chatId, currentUserId);

        DateTimeOffset? recipientLastReadMessageSentAt = null;

        if (recipientLastReadMessageId.HasValue)
        {
            recipientLastReadMessageSentAt = messages.FirstOrDefault(m => m.Id == recipientLastReadMessageId.Value)?.SentAt;

            if (recipientLastReadMessageSentAt is null)
                recipientLastReadMessageSentAt = await _messagesRepository.GetSentAtById(recipientLastReadMessageId.Value);
        }

        return messages.Select(m =>
        {
            var messageReactions = reactionsByMessage.GetValueOrDefault(m.Id) ?? new List<MessageReaction>();

            var reactionDtos = messageReactions
                .GroupBy(mr => mr.Emoji)
                .Select(g => new ReactionDto(
                    Emoji: g.Key,
                    Count: g.Count(),
                    IsOwn: g.Any(r => r.UserId == currentUserId)
                ))
                .ToList();

            return new MessageDto
            (
                m.Id,
                m.ChatId,
                m.SenderId,
                m.Text,
                m.SentAt,
                CalculateMessageStatus(m, currentUserId, recipientLastReadMessageSentAt),
                reactionDtos
            );
        }).ToList();
    }

    public async Task SetReaction(Guid messageId, Guid userId, string emoji)
    {
        var existingReaction = await _messageReactionsRepository.GetByMessageIdAndUserId(messageId, userId);
        
        if (existingReaction is null)
        {
            var reaction = MessageReaction.Create(messageId, userId, emoji);

            await _messageReactionsRepository.Add(reaction);
        }
        else if (existingReaction.Emoji == emoji)
        {
            await _messageReactionsRepository.Remove(existingReaction.Id);
        }
        else
        {
            var newReaction = MessageReaction.Restore(
                existingReaction.Id,
                messageId,
                userId,
                emoji,
                DateTimeOffset.UtcNow
            );

            await _messageReactionsRepository.Update(newReaction);
        }

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<ReactionDto>> GetMessageReactions(Guid messageId, Guid currentUserId)
    {
        var messageReactions = await _messageReactionsRepository.GetByMessageId(messageId);

        return messageReactions
            .GroupBy(mr => mr.Emoji)
            .Select(g => new ReactionDto(
                Emoji: g.Key,
                Count: g.Count(),
                IsOwn: g.Any(r => r.UserId == currentUserId)
            ))
            .ToList();
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
