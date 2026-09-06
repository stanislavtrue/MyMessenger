using Chat.Application.DTOs;
using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IChatMembersRepository
{
    Task Add(ChatMember member);
    Task<List<Guid>> GetChatIdsByUserId(Guid userId);
    Task<List<ChatMember>> GetMembersByChatId(Guid chatId);
    Task<Guid?> GetOtherUserId(Guid chatId, Guid currentUserId);
    Task<List<ChatMemberDto>> GetOtherUsersByChatIds(List<Guid> chatIds, Guid currentUserId);
    Task<Guid?> GetLastReadMessageId(Guid chatId, Guid currentUserId);
    Task<List<ChatMember>> GetByUserIdAndChatIds(List<Guid> chatIds, Guid userId);
    Task MarkAsRead(Guid chatId, Guid userId, Guid messageId, int unreadCount);
    Task IncrementUnreadCount(Guid chatId, Guid senderId);
    Task<int> GetUnreadCount(Guid chatId, Guid userId);
    Task<bool> HasAccess(Guid chatId, Guid userId);
}
