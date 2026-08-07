public class InvalidRefreshTokenException(string? message = null) 
    : Exception(message ?? "Invalid refresh token");
