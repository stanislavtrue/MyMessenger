public class RefreshTokenRevokedException(string? message = null) 
    : Exception(message ?? "Refresh token revoked");
