using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Models;
using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Persistence.Repositories;
public class MessagesRepository : IMessagesRepository
{
    private readonly ChatDbContext _context;

    public MessagesRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(Message message)
    {
        var messageEntity = new MessageEntity
        {
            Id = message.Id,
            ChatId = message.ChatId,
            SenderId = message.SenderId,
            Text = message.Text,
            SentAt = message.SentAt,
            DeletedAt = message.DeletedAt,
            ReplyToMessageId = message.ReplyToMessageId
        };

        await _context.Messages.AddAsync(messageEntity);
    }

    public async Task<(List<Message> Messages, bool HasMore)> GetPageByChatId(Guid chatId, Guid currentUserId, Guid? beforeMessageId, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _context.Messages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .Where(m => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == m.Id && udm.UserId == currentUserId));

        if (beforeMessageId.HasValue)
        {
            var cursor = await _context.Messages
                .AsNoTracking()
                .Where(m => m.Id == beforeMessageId.Value && m.ChatId == chatId)
                .Select(m => new { m.Id, m.SentAt })
                .FirstOrDefaultAsync(cancellationToken);

            if (cursor is null)
                throw new MessageNotFoundException();

            query = query.Where(m =>
                m.SentAt < cursor.SentAt ||
                (m.SentAt == cursor.SentAt && 
                m.Id.CompareTo(cursor.Id) < 0));
        }

        var entities = await query
            .OrderByDescending(m => m.SentAt)
            .ThenByDescending(m => m.Id)
            .Take(pageSize + 1)
            .ToListAsync(cancellationToken);

        var hasMore = entities.Count > pageSize;

        if (hasMore)
            entities.RemoveAt(entities.Count - 1);

        entities.Reverse();

        var messages = entities.Select(m => Message.Restore(
            m.Id,
            m.ChatId,
            m.SenderId,
            m.Text,
            m.SentAt,
            m.DeletedAt,
            m.ReplyToMessageId
        )).ToList();

        return (messages, hasMore);
    }

    public async Task<List<Message>> GetByChatId(Guid chatId, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var messageEntities = await _context.Messages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .Where(m => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == m.Id && udm.UserId == currentUserId))
            .OrderBy(m => m.SentAt)
            .ToListAsync(cancellationToken);

        return messageEntities.Select(m => Message.Restore(
            m.Id,
            m.ChatId,
            m.SenderId,
            m.Text,
            m.SentAt,
            m.DeletedAt,
            m.ReplyToMessageId
        )).ToList();
    }

    public async Task<Dictionary<Guid, ReplyMessageDto>> GetReplyPreviews(List<Guid> replyToIds, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        var distinctIds = replyToIds.Distinct().ToList();
        if (!distinctIds.Any())
            return new Dictionary<Guid, ReplyMessageDto>();

        return await (
            from message in _context.Messages.AsNoTracking()
            join user in _context.Users.AsNoTracking() on message.SenderId equals user.Id
            where distinctIds.Contains(message.Id)
            where message.DeletedAt == null
            where !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == message.Id && udm.UserId == currentUserId)
            select new
            {
                message.Id,
                SenderName = user.DisplayName,
                message.Text,
                IsDeleted = message.DeletedAt.HasValue
            }
        ).ToDictionaryAsync(
            x => x.Id,
            x => new ReplyMessageDto(
                x.Id,
                x.SenderName,
                x.Text,
                x.IsDeleted
            ),
            cancellationToken
        );
    }

    public async Task<Message> GetById(Guid messageId)
    {
        var messageEntity = await _context.Messages
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == messageId) ?? throw new MessageNotFoundException();

        return Message.Restore(
            messageEntity.Id, 
            messageEntity.ChatId, 
            messageEntity.SenderId, 
            messageEntity.Text, 
            messageEntity.SentAt, 
            messageEntity.DeletedAt,
            messageEntity.ReplyToMessageId);
    }

    public async Task<DateTimeOffset?> GetSentAtById(Guid messageId)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => m.Id == messageId)
            .Select(m => m.SentAt)
            .FirstOrDefaultAsync();
    }

    public async Task<Guid> GetChatIdById(Guid messageId)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => m.Id == messageId)
            .Select(m => (Guid?)m.ChatId)
            .FirstOrDefaultAsync() ?? throw new MessageNotFoundException();;
    }

    public async Task<List<LastMessageDto>> GetLastMessagesByChatIds(List<Guid> chatIds, Guid currentUserId, CancellationToken cancellationToken = default)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => chatIds.Contains(m.ChatId))
            .Where(m => m.DeletedAt == null)
            .Where(m => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == m.Id && udm.UserId == currentUserId))
            .GroupBy(m => m.ChatId)
            .Select(g => g
                .OrderByDescending(m => m.SentAt)
                .Select(m => new LastMessageDto(
                    m.ChatId,
                    m.Text,
                    m.SentAt
                ))
                .First())
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<Guid, LastMessageDto>> GetLastMessagesByUserIds(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Where(u => userIds.Contains(u.Id))
            .Select(u => new
            {
                UserId = u.Id,
                LastMessage = _context.Messages
                    .Where(m => m.ChatId == chatId)
                    .Where(m => m.DeletedAt == null)
                    .Where(m => !_context.UserDeletedMessages
                        .Any(udm => 
                            udm.MessageId == m.Id && 
                            udm.UserId == u.Id))
                    .OrderByDescending(m => m.SentAt)
                    .Select(m => new LastMessageDto(
                        m.ChatId,
                        m.Text,
                        m.SentAt
                    ))
                    .FirstOrDefault()
            })
            .ToDictionaryAsync(
                x => x.UserId,
                x => x.LastMessage ?? new LastMessageDto(chatId, null, null),
                cancellationToken);
    }

    public async Task<LastMessageDto?> GetLastMessageByUserId(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .Where(m => m.DeletedAt == null)
            .Where(m => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == m.Id && udm.UserId == userId))
            .OrderByDescending(m => m.SentAt)
            .Select(m => new LastMessageDto(
                m.ChatId,
                m.Text,
                m.SentAt
            ))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCount(Guid chatId, Guid userId, DateTimeOffset? sentAt)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m =>
                m.ChatId == chatId &&
                m.SenderId != userId &&
                m.SentAt > sentAt)
            .Where(m => m.DeletedAt == null)
            .Where(m => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == m.Id && udm.UserId == userId))
            .CountAsync();
    }

    public async Task DeleteForUser(Guid userId, Guid messageId, CancellationToken cancellationToken = default)
    {
        var alreadyDeleted = await _context.UserDeletedMessages
            .AnyAsync(udm => udm.UserId == userId && udm.MessageId == messageId, cancellationToken);

        if (!alreadyDeleted)
        {
            var udm = UserDeletedMessage.Create(userId, messageId);

            var entity = new UserDeletedMessageEntity
            {
                Id = udm.Id,
                UserId = udm.UserId,
                MessageId = udm.MessageId,
                DeletedAt = udm.DeletedAt
            };

            await _context.UserDeletedMessages.AddAsync(entity, cancellationToken);
        }
    }

    public async Task DeleteForEveryone(Message message, CancellationToken cancellationToken = default)
    {
        var messageEntity = await _context.Messages
            .FirstOrDefaultAsync(m => m.Id == message.Id, cancellationToken) ?? throw new MessageNotFoundException();

        messageEntity.DeletedAt = message.DeletedAt;
    }
}
