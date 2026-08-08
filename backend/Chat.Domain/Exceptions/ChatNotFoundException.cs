public class ChatNotFoundException(string? message = null) 
    : Exception(message ?? "Chat not found");
