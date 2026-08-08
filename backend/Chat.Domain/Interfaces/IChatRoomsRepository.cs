using Chat.Domain.Models;

namespace Chat.Domain.Interfaces;
public interface IChatRoomsRepository
{
    Task Add(ChatRoom chat);
}
