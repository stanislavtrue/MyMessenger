public class ReactionNotFoundException(string? message = null) 
    : Exception(message ?? "Reaction not found");
