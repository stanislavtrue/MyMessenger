using Chat.Domain.Models;

namespace Chat.Application.Interfaces;
public interface IChatRoomsRepository
{
    Task Add(ChatRoom chat);
    Task<List<ChatRoom>> GetByIds(List<Guid> chatIds);
}
