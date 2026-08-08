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

    public async Task<bool> HasAccess(Guid chatId, Guid userId)
    {
        return await _context.ChatMembers
            .AsNoTracking()
            .AnyAsync(cm => 
                cm.ChatId == chatId && 
                cm.UserId == userId);
    }
}
