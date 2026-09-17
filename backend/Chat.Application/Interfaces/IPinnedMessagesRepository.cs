using Chat.Application.DTOs;
using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IPinnedMessagesRepository
{
    Task PinMessage(PinnedMessage pinnedMessage, CancellationToken cancellationToken = default);
    Task UnpinMessage(Guid messageId, CancellationToken cancellationToken = default);
    Task<List<PinnedMessage>> GetByChatId(Guid chatId, Guid userId, CancellationToken cancellationToken = default);
    Task<List<PinnedMessageDto>> GetByChatIds(List<Guid> chatIds, Guid userId, CancellationToken cancellationToken = default);
    Task<bool> IsPinned(Guid messageId, CancellationToken cancellationToken = default);
}
