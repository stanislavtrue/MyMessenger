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

        var unreadCount = await _chatRoomsService.GetUnreadCount(chatId, userId);

        await Clients.Group(chatId.ToString())
            .SendAsync("MessagesRead", new
            {
                ChatId = chatId,
                UserId = userId,
                LastReadMessageId = messageId,
                UnreadCount = unreadCount
            });
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();

        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");

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

        var chatMembers = await _chatRoomsService.GetChatMembers(chatId);

        foreach (var chatMember in chatMembers)
        {
            await Clients.Group($"user_{chatMember.UserId}")
                .SendAsync("ChatUpdated", new
                {
                    ChatId = chatId,
                    LastMessage = message.Text,
                    LastMessageAt = message.SentAt,
                    UnreadCount = chatMember.UnreadCount
                });
        }
    }

    public async Task SetReaction(Guid chatId, Guid messageId, string emoji)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        await _messagesService.SetReaction(messageId, userId, emoji);

        var updatedReactions = await _messagesService.GetMessageReactions(messageId, userId);

        await Clients.Group(chatId.ToString())
            .SendAsync("ReactionUpdated", new
            {
                ChatId = chatId,
                MessageId = messageId,
                Reactions = updatedReactions
            });
    }

    public async Task JoinChat(Guid chatId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();
        
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
    }

    public async Task StartTyping(Guid chatId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        await Clients.OthersInGroup(chatId.ToString())
            .SendAsync("UserStartTyping", new
            {
                ChatId = chatId,
                UserId = userId
            });
    }

    public async Task StopTyping(Guid chatId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        await Clients.OthersInGroup(chatId.ToString())
            .SendAsync("UserStopTyping", new
            {
                ChatId = chatId,
                UserId = userId
            });
    }
}
