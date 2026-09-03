using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IMessageReactionsRepository
{
    Task Add(MessageReaction reaction);
    Task<List<MessageReaction>> GetByMessageIds(List<Guid> messageIds);
    Task<List<MessageReaction>> GetByMessageId(Guid messageId);
    Task<MessageReaction?> GetByMessageIdAndUserId(Guid messageid, Guid userId);
    Task Remove(Guid id);
    Task Update(MessageReaction reaction);
}
