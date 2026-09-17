using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Models;
using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Persistence.Repositories;
public class PinnedMessagesRepository : IPinnedMessagesRepository
{
    private readonly ChatDbContext _context;

    public PinnedMessagesRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task PinMessage(PinnedMessage pinnedMessage, CancellationToken cancellationToken = default)
    {
        var pinnedMessageEntity = new PinnedMessageEntity
        {
            Id = pinnedMessage.Id,
            MessageId = pinnedMessage.MessageId,
            PinnedByUserId = pinnedMessage.PinnedByUserId,
            PinnedAt = pinnedMessage.PinnedAt
        };

        await _context.PinnedMessages.AddAsync(pinnedMessageEntity);
    }

    public async Task UnpinMessage(Guid messageId, CancellationToken cancellationToken = default)
    {
        var pinnedMessageEntity = await _context.PinnedMessages
            .FirstOrDefaultAsync(pm => pm.MessageId == messageId, cancellationToken);

        if (pinnedMessageEntity is null)
            return;

        _context.PinnedMessages.Remove(pinnedMessageEntity);
    }

    public async Task<List<PinnedMessage>> GetByChatId(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
    {
        var pinnedMessageEntities = await _context.PinnedMessages
            .AsNoTracking()
            .Where(pm => pm.Message.ChatId == chatId)
            .Where(pm => pm.Message.DeletedAt == null)
            .Where(pm => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == pm.MessageId && udm.UserId == userId))
            .OrderByDescending(pm => pm.PinnedAt)
            .ToListAsync(cancellationToken);

        return pinnedMessageEntities.Select(pm => PinnedMessage.Restore(
            pm.Id,
            pm.MessageId,
            pm.PinnedByUserId,
            pm.PinnedAt
        )).ToList();
    }

    public async Task<List<PinnedMessageDto>> GetByChatIds(List<Guid> chatIds, Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.PinnedMessages
            .AsNoTracking()
            .Include(pm => pm.Message)
            .Where(pm => chatIds.Contains(pm.Message.ChatId))
            .Where(pm => pm.Message.DeletedAt == null)
            .Where(pm => !_context.UserDeletedMessages
                .Any(udm => udm.MessageId == pm.MessageId && udm.UserId == userId))
            .Select(pm => new PinnedMessageDto(
                pm.MessageId,
                pm.Message.ChatId,
                pm.PinnedByUserId,
                pm.Message.Text,
                pm.PinnedAt
            ))
            .ToListAsync();
    }

    public async Task<bool> IsPinned(Guid messageId, CancellationToken cancellationToken = default)
    {
        return await _context.PinnedMessages
            .AnyAsync(pm => pm.MessageId == messageId, cancellationToken);
    }
}
