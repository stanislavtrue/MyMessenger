public class InvalidCredentialsException(string? message = null) 
    : Exception(message ?? "Invalid credentials");
