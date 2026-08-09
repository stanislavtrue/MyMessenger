using Chat.Domain.Services;
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

    [Authorize]
    [HttpGet("{chatId}")]
    public async Task<IActionResult> Messages(Guid chatId)
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        if (!await _chatRoomService.HasAccess(chatId, userId))
            throw new ChatAccessDeniedException();

        var messages = await _messagesService.GetByChatId(chatId);

        return Ok(messages);
    }
}   
