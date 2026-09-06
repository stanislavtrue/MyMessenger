namespace Chat.Application.DTOs;
public record LoginResultDto
(
    string AccessToken,
    string RefreshToken
);
