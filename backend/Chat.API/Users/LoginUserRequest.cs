using System.ComponentModel.DataAnnotations;

namespace Chat.API.Users;
public record LoginUserRequest
(
    [Required] string Email,
    [Required] string Password
);
