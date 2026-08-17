public class ChatMemberNotFoundException(string? message = null)
    : Exception(message ?? "Chat member not found");
