using System.Runtime.InteropServices;
using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
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
            UserId = member.UserId
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

    public async Task<Guid?> GetOtherUserId(Guid chatId, Guid currentUserId)
    {
        var otherUserId = await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => cm.ChatId == chatId && cm.UserId != currentUserId)
            .Select(cm => (Guid?)cm.UserId)
            .FirstOrDefaultAsync();

        return otherUserId;
    }

    public async Task<List<ChatMemberInfo>> GetOtherUsersByChatIds(List<Guid> chatIds, Guid currentUserId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .Where(cm => 
                chatIds.Contains(cm.ChatId) &&
                cm.UserId != currentUserId)
            .Select(cm => new ChatMemberInfo(
                cm.ChatId, 
                cm.UserId))
            .ToListAsync();
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
