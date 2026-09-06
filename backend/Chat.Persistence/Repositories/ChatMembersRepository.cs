using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Domain.Models;
using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Persistence.Repositories;
public class ChatMembersRepository : IChatMembersRepository
{
    private readonly ChatDbContext _context;

    public ChatMembersRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(ChatMember member)
    {
        var chatMemberEntity = new ChatMemberEntity
        {
            Id = member.Id,
            ChatId = member.ChatId,
            UserId = member.UserId,
            LastReadMessageId = member.LastReadMessageId,
            UnreadCount = member.UnreadCount
        };

        await _context.ChatMembers.AddAsync(chatMemberEntity);
    }

    public async Task<List<Guid>> GetChatIdsByUserId(Guid userId)
    {
        var chatRoomIds = await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.UserId == userId)
            .Select(cm => cm.ChatId)
            .ToListAsync();

        return chatRoomIds;
    }

    public async Task<List<ChatMember>> GetMembersByChatId(Guid chatId)
    {
        var chatMemberEntities = await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.ChatId == chatId)
            .ToListAsync();

        return chatMemberEntities
            .Select(e => ChatMember.Restore(e.Id, e.ChatId, e.UserId, e.LastReadMessageId, e.UnreadCount))
            .ToList();
    }

    public async Task<Guid?> GetOtherUserId(Guid chatId, Guid currentUserId)
    {
        var otherUserId = await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.ChatId == chatId && cm.UserId != currentUserId)
            .Select(cm => (Guid?)cm.UserId)
            .FirstOrDefaultAsync();

        return otherUserId;
    }

    public async Task<Guid?> GetLastReadMessageId(Guid chatId, Guid currentUserId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.ChatId == chatId && cm.UserId != currentUserId)
            .Select(cm => cm.LastReadMessageId)
            .FirstOrDefaultAsync();
    }

    public async Task<List<ChatMemberDto>> GetOtherUsersByChatIds(List<Guid> chatIds, Guid currentUserId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => 
                chatIds.Contains(cm.ChatId) &&
                cm.UserId != currentUserId)
            .Select(cm => new ChatMemberDto(
                cm.ChatId, 
                cm.UserId))
            .ToListAsync();
    }

    public async Task<List<ChatMember>> GetByUserIdAndChatIds(List<Guid> chatIds, Guid userId)
    {
        if (chatIds is null || !chatIds.Any())
            return [];

        var memberEntities = await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.UserId == userId && chatIds.Contains(cm.ChatId))
            .ToListAsync();
           
        return memberEntities
            .Select(e => ChatMember.Restore(e.Id, e.ChatId, e.UserId, e.LastReadMessageId, e.UnreadCount))
            .ToList();
    }

    public async Task MarkAsRead(Guid chatId, Guid userId, Guid messageId, int unreadCount)
    {
        await _context.ChatMembers
            .Where(cm => cm.ChatId == chatId && cm.UserId == userId)      
            .ExecuteUpdateAsync(s => s
                .SetProperty(cm => cm.LastReadMessageId, messageId)
                .SetProperty(cm => cm.UnreadCount, unreadCount));
    }

    public async Task IncrementUnreadCount(Guid chatId, Guid senderId)
    {
        await _context.ChatMembers
            .Where(cm => cm.ChatId == chatId && cm.UserId != senderId)
            .ExecuteUpdateAsync(s => s.SetProperty(
                cm => cm.UnreadCount,
                cm => cm.UnreadCount + 1));
    }

    public async Task<int> GetUnreadCount(Guid chatId, Guid userId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.ChatId == chatId && cm.UserId == userId)
            .Select(cm => cm.UnreadCount)
            .FirstOrDefaultAsync();
    }


    public async Task<bool> HasAccess(Guid chatId, Guid userId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .AnyAsync(cm => 
                cm.ChatId == chatId && 
                cm.UserId == userId);
    }
}
