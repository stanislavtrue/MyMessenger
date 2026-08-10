using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IChatMembersRepository
{
    Task Add(ChatMember member);
    Task<List<Guid>> GetChatIdsByUserId(Guid userId);
    Task<Guid?> GetOtherUserId(Guid chatId, Guid currentUserId);
    Task<List<ChatMemberInfo>> GetOtherUsersByChatIds(List<Guid> chatIds, Guid currentUserId);
    Task<bool> HasAccess(Guid chatId, Guid userId);
}
