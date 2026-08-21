using Chat.Domain.Interfaces;
using Chat.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chat.API.Hubs;
[Authorize]
public class ChatHub : Hub
{
    private readonly MessagesService _messagesService;
    private readonly ChatRoomsService _chatRoomsService;
    private readonly UsersService _usersService;
    private readonly IUserStatusTracker _userStatusTracker;
    
    public ChatHub(MessagesService messagesService, ChatRoomsService chatRoomsService, UsersService usersService, IUserStatusTracker userStatusTracker)
    {
        _messagesService = messagesService;
        _chatRoomsService = chatRoomsService;
        _usersService = usersService;
        _userStatusTracker = userStatusTracker;
    }

    private Guid GetUserId()
    {
        var userIdClaim = Context.User?.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            throw new UserNotFoundException();

        return userId;
    }

    public async Task MarkMessageAsRead(Guid chatId, Guid messageId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        await _chatRoomsService.MarkAsRead(chatId, userId, messageId);

        await Clients.Group(chatId.ToString())
            .SendAsync("MessagesRead", new
            {
                ChatId = chatId,
                LastReadMessageId = messageId
            });
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        var isFirstConnection =  await _userStatusTracker.AddConnectionAsync(userId, Context.ConnectionId);

        if (isFirstConnection)
        {
            await Clients.Others.SendAsync("UserStatusChanged", new
            {
                UserId = userId,
                IsOnline = true
            });
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();

        var isOffline = await _userStatusTracker.RemoveConnectionAsync(userId, Context.ConnectionId);

        if (isOffline)
        {
            var lastSeenAt = DateTimeOffset.UtcNow;

            await _usersService.UpdateLastSeen(userId, lastSeenAt);

            await Clients.Others.SendAsync("UserStatusChanged", new
            {
                UserId = userId,
                IsOnline = false,
                LastSeenAt = lastSeenAt
            });
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(Guid chatId, string text)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        var message = await _messagesService.Send(chatId, userId, text);

        await Clients.Group(chatId.ToString())
            .SendAsync("ReceiveMessage", message);
    }

    public async Task JoinChat(Guid chatId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();
        
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
    }
}
