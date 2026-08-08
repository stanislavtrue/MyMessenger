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

    public async Task<ChatRoom> GetById(Guid id)
    {
        var chatEntity = await _context.ChatRooms
            .AsNoTracking()
            .FirstOrDefaultAsync(cr => cr.Id == id) ?? throw new ChatNotFoundException();

        return ChatRoom.Restore(chatEntity.Id, chatEntity.Name, chatEntity.CreatedAt);
    }
}
