namespace Chat.API.Responses;
public record PinnedMessageResponse
(
    Guid MessageId,
    Guid PinnedByUserId,
    string Text,
    DateTimeOffset PinnedAt
);
