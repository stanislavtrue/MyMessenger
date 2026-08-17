using Chat.Domain.Interfaces;
using Chat.Domain.Models;

namespace Chat.Domain.Services;
public class ChatRoomsService
{
    private readonly IChatRoomsRepository _chatRoomsRepository;
    private readonly IChatMembersRepository _chatMembersRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly IMessagesRepository _messagesRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ChatRoomsService(
        IChatRoomsRepository chatRoomsRepository, 
        IChatMembersRepository chatMembersRepository, 
        IUsersRepository usersRepository, 
        IMessagesRepository messagesRepository,
        IUnitOfWork unitOfWOrk)
    {
        _chatRoomsRepository = chatRoomsRepository;
        _chatMembersRepository = chatMembersRepository;
        _usersRepository = usersRepository;
        _messagesRepository = messagesRepository;
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

    public async Task<List<ChatRoomWithUserWithUnreadCount>> GetByUserId(Guid userId)
    {
        var chatIds =  await _chatMembersRepository.GetChatIdsByUserId(userId);
        var chatRooms = await _chatRoomsRepository.GetByIds(chatIds);
        var memberInfos = await _chatMembersRepository.GetOtherUsersByChatIds(chatIds, userId);

        var currentMemberDetails = await _chatMembersRepository.GetByUserIdAndChatIds(chatIds, userId);

        var users = await  _usersRepository.GetByIds(memberInfos.Select(x => x.UserId).ToList());

        var result = new List<ChatRoomWithUserWithUnreadCount>();

        foreach (var chatRoom in chatRooms)
        {
            var memberInfo = memberInfos.FirstOrDefault(x => x.ChatId == chatRoom.Id);

            if (memberInfo is null)
                continue;

            var user = users.FirstOrDefault(x => x.Id == memberInfo.UserId);

            if (user is null)
                continue;

            var currentMember = currentMemberDetails.FirstOrDefault(cm => cm.ChatId == chatRoom.Id);

            var unreadCount = await _messagesRepository.GetUnreadCount(chatRoom.Id, currentMember?.LastReadMessageId);

            result.Add(new ChatRoomWithUserWithUnreadCount(chatRoom, user, unreadCount));
        }

        return result;
    }

    public async Task MarkAsRead(Guid chatId, Guid userId, Guid messageId)
    {
        await _chatMembersRepository.MarkAsRead(chatId, userId, messageId);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<bool> HasAccess(Guid chatId, Guid userId)
    {
        return await _chatMembersRepository.HasAccess(chatId, userId);
    }
}
