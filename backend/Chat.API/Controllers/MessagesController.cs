using Chat.API.Contracts.Chats;
using Chat.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers;
[ApiController]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly MessagesService _messagesService;
    private readonly ChatRoomsService _chatRoomService;
    public MessagesController(MessagesService messagesService, ChatRoomsService chatRoomsService)
    {
        _messagesService = messagesService;
        _chatRoomService = chatRoomsService;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            throw new UserNotFoundException();

        return userId;
    }

    [Authorize]
    [HttpGet("{chatId}")]
    public async Task<IActionResult> Messages(Guid chatId, [FromQuery] Guid? beforeMessageId, [FromQuery] int limit = 30, CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();

        if (!await _chatRoomService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        var response = await _messagesService.GetByChatId(userId, chatId, beforeMessageId, limit, cancellationToken);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("{chatId}/read")]
    public async Task<IActionResult> MarkAsRead([FromRoute] Guid chatId, [FromBody] MarkAsReadRequest request)
    {
        var userId = GetUserId();

        await _chatRoomService.MarkAsRead(chatId, userId, request.MessageId);

        return Ok();
    }

    [Authorize]
    [HttpDelete("{messageId}/for-me")]
    public async Task<IActionResult> DeleteForUser(Guid messageId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        await _messagesService.DeleteForUser(messageId, userId, cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{messageId}/for-everyone")]
    public async Task<IActionResult> DeleteForEveryone(Guid messageId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        await _messagesService.DeleteForEveryone(messageId, userId, cancellationToken);

        return NoContent();
    }
}   
