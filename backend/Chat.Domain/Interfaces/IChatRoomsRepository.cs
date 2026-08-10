using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IChatRoomsRepository
{
    Task Add(ChatRoom chat);
    Task<List<ChatRoom>> GetByIds(List<Guid> chatIds);
}
