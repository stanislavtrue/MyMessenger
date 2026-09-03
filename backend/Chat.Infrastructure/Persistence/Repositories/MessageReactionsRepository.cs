using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
public class MessageReactionsRepository : IMessageReactionsRepository
{
    private readonly ChatDbContext _context;

    public MessageReactionsRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(MessageReaction reaction)
    {
        var reactionEntity = new MessageReactionEntity
        {
            Id = reaction.Id,
            MessageId = reaction.MessageId,
            UserId = reaction.UserId,
            Emoji = reaction.Emoji,
            CreatedAt = reaction.CreatedAt
        };

        await _context.MessageReactions.AddAsync(reactionEntity);
    }

    public async Task Remove(Guid id)
    {
        var reactionEntity = await _context.MessageReactions.FindAsync(id);

        if (reactionEntity != null)
            _context.MessageReactions.Remove(reactionEntity);
    }

    public async Task Update(MessageReaction reaction)
    {
        var reactionEntity = await _context.MessageReactions.FindAsync(reaction.Id);

        if (reactionEntity != null)
        {
            reactionEntity.Emoji = reaction.Emoji;
            reactionEntity.CreatedAt = reaction.CreatedAt;
        }
    }

    public async Task<List<MessageReaction>> GetByMessageIds(List<Guid> messageIds)
    {
        if (messageIds.Count == 0)
            return [];

        var reactionEntities = await _context.MessageReactions
            .AsNoTracking()
            .Where(mr => messageIds.Contains(mr.MessageId))
            .ToListAsync();

        return reactionEntities
            .Select(e => MessageReaction.Restore(e.Id, e.MessageId, e.UserId, e.Emoji, e.CreatedAt))
            .ToList();
    }

    public async Task<List<MessageReaction>> GetByMessageId(Guid messageId)
    {
        var reactionEntities = await _context.MessageReactions
            .AsNoTracking()
            .Where(mr => mr.MessageId == messageId)
            .ToListAsync();

        return reactionEntities
            .Select(e => MessageReaction.Restore(e.Id, e.MessageId, e.UserId, e.Emoji, e.CreatedAt))
            .ToList();
    }

    public async Task<MessageReaction?> GetByMessageIdAndUserId(Guid messageid, Guid userId)
    {
        var reactionEntity = await _context.MessageReactions
            .AsNoTracking()
            .FirstOrDefaultAsync(mr =>
                mr.MessageId == messageid &&
                mr.UserId == userId);

        if (reactionEntity == null)
            return null;

        return MessageReaction.Restore(
            reactionEntity.Id,
            reactionEntity.MessageId,
            reactionEntity.UserId,
            reactionEntity.Emoji,
            reactionEntity.CreatedAt);
    }
}
