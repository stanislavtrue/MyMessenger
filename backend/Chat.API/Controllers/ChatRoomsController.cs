using Chat.API.Responses;
using Chat.Application.Interfaces;
using Chat.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ChatRoomsController : ControllerBase
{
    private readonly ChatRoomsService _chatRoomsService;
    private readonly IUserStatusTracker _userStatusTracker;

    public ChatRoomsController(ChatRoomsService chatRoomsService, IUserStatusTracker userStatusTracker)
    {
        _chatRoomsService = chatRoomsService;
        _userStatusTracker = userStatusTracker;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> ChatRooms()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var chatRooms = await _chatRoomsService.GetByUserId(userId);

        var responseTasks = chatRooms.Select(async chat => 
        {
            var isOnline = await _userStatusTracker.IsUserOnlineAsync(chat.User.Id);

            return new ChatRoomResponse(
                chat.ChatRoom.Id,
                chat.ChatRoom.Name,
                chat.ChatRoom.CreatedAt,
                new UserResponse(
                    chat.User.Id,
                    chat.User.DisplayName,
                    chat.User.Username,
                    chat.User.AvatarUrl,
                    isOnline,
                    chat.User.LastSeenAt
                ),
                chat.LastMessage,
                chat.LastMessageAt,
                chat.UnreadCount
            );
        });

        var response = await Task.WhenAll(responseTasks);

        return Ok(response);
    }
}
