public class UserNotFoundException(string? message = null) 
    : Exception(message ?? "User not found");
