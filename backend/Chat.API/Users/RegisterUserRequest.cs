using System.ComponentModel.DataAnnotations;

namespace Chat.API.Users;
public record RegisterUserRequest
(
    [Required] string Email,
    [Required] string Username,
    [Required] string Password
);
