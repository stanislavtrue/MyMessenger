using System.ComponentModel.DataAnnotations;

namespace Chat.API.Contracts.Auth;
public record LoginUserRequest
(
    [Required] string Email,
    [Required] string Password
);
