namespace Chat.API.Responses;
public record class UserResponse
(
    Guid Id,
    string DisplayName,
    string Username,
    string? Avatar,
    bool isOnline,
    DateTimeOffset? lastSeenAt
);
