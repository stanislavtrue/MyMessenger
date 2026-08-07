public class RefreshTokenNotFoundException(string? message = null) 
    : Exception(message ?? "Refresh token not found");
