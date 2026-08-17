public class MessageNotFoundException(string? message = null) 
    : Exception(message ?? "Message not found");
