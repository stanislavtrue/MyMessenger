using System.ComponentModel.DataAnnotations;

namespace Chat.API.Contracts.Auth;
public record RegisterUserRequest
(
    [Required] string Email,
    [Required] string Username,
    [Required] string Password
);
