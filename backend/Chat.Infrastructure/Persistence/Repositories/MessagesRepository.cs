using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
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
            SentAt = message.SentAt
        };

        await _context.Messages.AddAsync(messageEntity);
    }

    public async Task<List<Message>> GetByChatId(Guid chatId)
    {
        var messageEntities = await _context.Messages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var messages = new List<Message>();

        foreach (var messageEntity in messageEntities)
        {
            messages.Add(Message.Restore(
                messageEntity.Id,
                messageEntity.ChatId,
                messageEntity.SenderId,
                messageEntity.Text,
                messageEntity.SentAt
            ));
        }

        return messages;
    }

    public async Task<Message> GetById(Guid messageId)
    {
        var messageEntity = await _context.Messages
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == messageId) ?? throw new MessageNotFoundException();

        return Message.Restore(messageEntity.Id, messageEntity.ChatId, messageEntity.SenderId, messageEntity.Text, messageEntity.SentAt);
    }

    public async Task<DateTimeOffset?> GetSentAtById(Guid messageId)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => m.Id == messageId)
            .Select(m => m.SentAt)
            .FirstOrDefaultAsync();
    }

    public async Task<List<LastMessageDto>> GetLastMessagesByChatIds(List<Guid> chatIds)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m => chatIds.Contains(m.ChatId))
            .GroupBy(m => m.ChatId)
            .Select(g => g
                .OrderByDescending(m => m.SentAt)
                .Select(m => new LastMessageDto(
                    m.ChatId,
                    m.Text,
                    m.SentAt
                ))
                .First())
            .ToListAsync();
    }

    public async Task<int> GetUnreadCount(Guid chatId, Guid userId, DateTimeOffset? sentAt)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(m =>
                m.ChatId == chatId &&
                m.SenderId != userId &&
                m.SentAt > sentAt)
            .CountAsync();
    }
}
