public class RefreshTokenExpiredException(string? message = null) 
    : Exception(message ?? "Refresh token expired");
