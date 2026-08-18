using Chat.Domain.Enums;
using Chat.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chat.API.Hubs;
public class ChatHub : Hub
{
    private readonly MessagesService _messagesService;
    private readonly ChatRoomsService _chatRoomsService;
    
    public ChatHub(MessagesService messagesService, ChatRoomsService chatRoomsService)
    {
        _messagesService = messagesService;
        _chatRoomsService = chatRoomsService;
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

    [Authorize]
    public async Task SendMessage(Guid chatId, string text)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        var message = await _messagesService.Send(chatId, userId, text);

        await Clients.Group(chatId.ToString())
            .SendAsync("ReceiveMessage", message);
    }

    [Authorize]
    public async Task JoinChat(Guid chatId)
    {
        var userId = GetUserId();

        if (!await _chatRoomsService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();
        
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId.ToString());
    }
}
