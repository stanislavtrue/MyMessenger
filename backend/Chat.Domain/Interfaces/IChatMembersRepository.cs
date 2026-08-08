using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IChatMembersRepository
{
    Task Add(ChatMember member);
    Task<bool> HasAccess(Guid chatId, Guid userId);
}
