using Chat.API.Contracts.Auth;
using Chat.API.DTOs;
using Chat.Domain.Interfaces;
using Chat.Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chat.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UsersService _usersService;
    private readonly IUsersRepository _usersRepository;

    public AuthController(UsersService usersService, IUsersRepository usersRepository)
    {
        _usersService = usersService;
        _usersRepository = usersRepository;
    }

    private CookieOptions RefreshCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(30)
        };
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        await _usersService.Register(request.Username, request.Email, request.Password);
        
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest request) 
    {
        var result = await _usersService.Login(request.Email, request.Password);

        Response.Cookies.Append(
            "refresh_token", 
            result.RefreshToken, 
            RefreshCookieOptions());

        return Ok(new { accessToken = result.AccessToken });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Cookies["refresh_token"];

        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        if (token is null)
            return Unauthorized();
        
        await _usersService.Logout(userId, token);

        Response.Cookies.Delete("refresh_token");

        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var token = Request.Cookies["refresh_token"];

        if (token is null)
            return Unauthorized();

        var result = await _usersService.Refresh(token);

        if (result is null)
            return Unauthorized();
        
        Response.Cookies.Append(
            "refresh_token",
            result.RefreshToken,
            RefreshCookieOptions());

        return Ok(new { accessToken = result.AccessToken });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _usersRepository.GetById(userId);

        var response = new UserResponse(
            user.Id,
            user.DisplayName,
            user.Username,
            user.AvatarUrl
        );

        return Ok(response);
    }
}
