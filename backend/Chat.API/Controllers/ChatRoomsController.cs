using Chat.API.DTOs;
using Chat.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ChatRoomsController : ControllerBase
{
    private readonly ChatRoomsService _chatRoomsService;

    public ChatRoomsController(ChatRoomsService chatRoomsService)
    {
        _chatRoomsService = chatRoomsService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> ChatRooms()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var chatRooms = await _chatRoomsService.GetByUserId(userId);

        var response = chatRooms.Select(chat => new ChatRoomResponse(
            chat.ChatRoom.Id,
            chat.ChatRoom.Name,
            chat.ChatRoom.CreatedAt,
            new UserResponse(
                chat.User.Id,
                chat.User.DisplayName,
                chat.User.Username,
                chat.User.AvatarUrl
            ),
            null,
            null,
            chat.UnreadCount
        )).ToList();

        return Ok(response);
    }
}
