using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class ChatRoomsService
{
    private readonly IChatRoomsRepository _chatRoomsRepository;
    private readonly IChatMembersRepository _chatMembersRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ChatRoomsService(IChatRoomsRepository chatRoomsRepository, IChatMembersRepository chatMembersRepository, IUnitOfWork unitOfWOrk)
    {
        _chatRoomsRepository = chatRoomsRepository;
        _chatMembersRepository = chatMembersRepository;
        _unitOfWork = unitOfWOrk;
    }

    public async Task CreateChatRoom(Guid userId, string name)
    {
        var chatRoom = ChatRoom.Create(name);
        
        await _chatRoomsRepository.Add(chatRoom);

        var chatMember = ChatMember.Create(chatRoom.Id, userId);

        await _chatMembersRepository.Add(chatMember);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<bool> HasAccess(Guid chatId, Guid userId)
    {
        return await _chatMembersRepository.HasAccess(chatId, userId);
    }
}
