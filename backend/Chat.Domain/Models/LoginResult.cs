namespace Chat.Domain.Models;
public record LoginResult
(
    string AccessToken,
    string RefreshToken
);
