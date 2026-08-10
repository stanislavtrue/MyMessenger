namespace Chat.API.DTOs;
public record class UserResponse
(
    Guid Id,
    string DisplayName,
    string Username,
    string? Avatar
);
