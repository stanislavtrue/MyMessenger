using Chat.Domain.Enums;
using Chat.Application.Interfaces;
using Chat.Domain.Models;
using Chat.Application.DTOs;

namespace Chat.Application.Services;
public class MessagesService
{
    private readonly IUsersRepository _usersRepository;
    private readonly IMessagesRepository _messagesRepository;
    private readonly IChatMembersRepository _chatMemberRepository;
    private readonly IMessageReactionsRepository _messageReactionsRepository;
    private readonly IPinnedMessagesRepository _pinnedMessagesRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MessagesService(
        IUsersRepository usersRepository,
        IMessagesRepository messagesRepository, 
        IChatMembersRepository chatMembersRepository, 
        IMessageReactionsRepository messageReactionsRepository, 
        IPinnedMessagesRepository pinnedMessagesRepository, 
        IUnitOfWork unitOfWork)
    {
        _usersRepository = usersRepository;
        _messagesRepository = messagesRepository;
        _chatMemberRepository = chatMembersRepository;
        _messageReactionsRepository = messageReactionsRepository;
        _pinnedMessagesRepository = pinnedMessagesRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<MessageDto> Send(Guid chatId, Guid senderId, string text, Guid? replyToMessageId = null)
    {
        ReplyMessageDto? replyMessageDto = null;

        if (replyToMessageId.HasValue)
        {
            var parentMessage = await _messagesRepository.GetById(replyToMessageId.Value);

            if (parentMessage.ChatId != chatId)
            {
                throw new InvalidReplyMessageException();
            }

            var senderName = await _usersRepository.GetDisplayName(parentMessage.SenderId);

            replyMessageDto = new ReplyMessageDto(
                parentMessage.Id,
                senderName,
                parentMessage.Text,
                parentMessage.IsDeleted
            );
        }

        var message = Message.Create(chatId, senderId, text, replyToMessageId);

        await _messagesRepository.Add(message);
        
        await _unitOfWork.SaveChangesAsync();

        await _chatMemberRepository.MarkAsRead(chatId, senderId, message.Id, unreadCount: 0);

        await _chatMemberRepository.IncrementUnreadCount(chatId, senderId);

        return new MessageDto(
            message.Id,
            message.ChatId,
            message.SenderId,
            message.Text,
            message.SentAt,
            message.IsDeleted,
            Status: MessageStatus.Sent,
            Reactions: new List<ReactionDto>(),
            replyMessageDto
        );
    }

    public async Task<Message> GetById(Guid messageId)
    {
        return await _messagesRepository.GetById(messageId);
    }

    public async Task<List<MessageDto>> GetByChatId(Guid currentUserId, Guid chatId, CancellationToken cancellationToken)
    {
        var messages = await _messagesRepository.GetByChatId(chatId, currentUserId, cancellationToken);

        var messageIds = messages.Select(m => m.Id).ToList();

        var replyToIds = messages
            .Where(m => m.ReplyToMessageId.HasValue)
            .Select(m => m.ReplyToMessageId!.Value)
            .ToList();

        var replyPreviews = await _messagesRepository.GetReplyPreviews(replyToIds, currentUserId, cancellationToken);

        var reactions = await _messageReactionsRepository.GetByMessageIds(messageIds);

        var reactionsByMessage = reactions
            .GroupBy(mr => mr.MessageId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var recipientLastReadMessageId = await _chatMemberRepository.GetOtherUserLastReadMessageId(chatId, currentUserId);

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

            ReplyMessageDto? replyToMessageDto = null;
            if (m.ReplyToMessageId.HasValue)
            {
                replyPreviews.TryGetValue(m.ReplyToMessageId.Value, out replyToMessageDto);
            }

            return new MessageDto
            (
                m.Id,
                m.ChatId,
                m.SenderId,
                m.IsDeleted ? "Deleted" : m.Text,
                m.SentAt,
                m.IsDeleted,
                CalculateMessageStatus(m, currentUserId, recipientLastReadMessageSentAt),
                reactionDtos,
                replyToMessageDto
            );
        }).ToList();
    }

    public async Task<Dictionary<Guid, LastMessageDto>> GetLastMessagesByUserIds(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default)
    {
        return await _messagesRepository.GetLastMessagesByUserIds(chatId, userIds, cancellationToken);
    }

    public async Task<LastMessageDto?> GetLastMessageByUserId(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _messagesRepository.GetLastMessageByUserId(chatId, userId, cancellationToken);
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

    public async Task DeleteForEveryone(Guid messageId, Guid userId, CancellationToken cancellationToken = default)
    {
        var message = await _messagesRepository.GetById(messageId);

        if (!await _chatMemberRepository.HasAccess(message.ChatId, userId))
            throw new ChatAccessDeniedException();

        if (message.IsDeleted)
            return;

        message.Delete(DateTimeOffset.UtcNow);

        await _messagesRepository.DeleteForEveryone(message, cancellationToken);

        await _pinnedMessagesRepository.UnpinMessage(messageId, cancellationToken);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteForUser(Guid messageId, Guid userId, CancellationToken cancellationToken = default)
    {
        var message = await _messagesRepository.GetById(messageId);

        if (!await _chatMemberRepository.HasAccess(message.ChatId, userId))
            throw new ChatAccessDeniedException();

        await _messagesRepository.DeleteForUser(userId, messageId, cancellationToken);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PinnedMessageDto?> PinMessage(Guid messageId, Guid userId, CancellationToken cancellationToken = default)
    {
        var message = await _messagesRepository.GetById(messageId);

        if (!await _chatMemberRepository.HasAccess(message.ChatId, userId))
            throw new ChatAccessDeniedException();
        
        if (message.IsDeleted)
            return null;

        var isPinned = await _pinnedMessagesRepository.IsPinned(messageId, cancellationToken);

        if (isPinned)
            return null;

        var pinnedMessage = PinnedMessage.Create(messageId, userId);

        await _pinnedMessagesRepository.PinMessage(pinnedMessage, cancellationToken);

        await _unitOfWork.SaveChangesAsync();

        return new PinnedMessageDto(
            pinnedMessage.MessageId,
            message.ChatId,
            pinnedMessage.PinnedByUserId,
            message.Text,
            pinnedMessage.PinnedAt
        );
    }

    public async Task UnpinMessage(Guid messageId, Guid userId, CancellationToken cancellationToken = default)
    {
        var message = await _messagesRepository.GetById(messageId);

        if (!await _chatMemberRepository.HasAccess(message.ChatId, userId))
            throw new ChatAccessDeniedException();

        await _pinnedMessagesRepository.UnpinMessage(messageId, cancellationToken);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<PinnedMessage>> GetPinnedMessagesByChatId(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
    {
        if (!await _chatMemberRepository.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        return await _pinnedMessagesRepository.GetByChatId(chatId, userId, cancellationToken);
    }
}
