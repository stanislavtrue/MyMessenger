using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
public class ChatRoomsRepository : IChatRoomsRepository
{
    private readonly ChatDbContext _context;

    public ChatRoomsRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(ChatRoom chat)
    {
        var chatEntity = new ChatRoomEntity
        {
            Id = chat.Id,
            Name = chat.Name,
            CreatedAt = chat.CreatedAt
        };

        await _context.ChatRooms.AddAsync(chatEntity);
    }

    public async Task<List<ChatRoom>> GetByIds(List<Guid> chatIds)
    {
        var chatEntities = await _context.ChatRooms
            .AsNoTracking()
            .Where(chat => chatIds.Contains(chat.Id))
            .ToListAsync();

        var chatRooms = new List<ChatRoom>();

        foreach(var chatEntity in chatEntities)
        {
            chatRooms.Add(ChatRoom.Restore(chatEntity.Id, chatEntity.Name, chatEntity.CreatedAt));
        }

        return chatRooms;
    }
}
