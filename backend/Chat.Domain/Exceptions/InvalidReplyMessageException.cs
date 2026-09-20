public class InvalidReplyMessageException(string? message = null)
    : Exception(message ?? "Cannot reply to a message");
