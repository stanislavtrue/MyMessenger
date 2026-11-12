using Chat.Application.DTOs;
using Chat.Application.Interfaces;
using Chat.Application.Services;
using Chat.Domain.Enums;
using Chat.Domain.Models;
using Moq;
using Xunit;

public class MessagesServicesTests
{
    [Fact]
    public async Task Send_WithoutReply_CreatesAndReturnsMessage()
    {
        var chatId = Guid.NewGuid();
        var senderId = Guid.NewGuid();
        var text = "message";
        
        var messagesRepository = new Mock<IMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        Message? addedMessage = null;

        messagesRepository
            .Setup(r => r.Add(It.IsAny<Message>()))
            .Callback<Message>(m => addedMessage = m)
            .Returns(Task.CompletedTask);

        var chatMembersRepository = new Mock<IChatMembersRepository>();

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            unitOfWork: unitOfWork);

        var act = await service.Send(chatId, senderId, text);

        Assert.NotNull(addedMessage);
        Assert.Equal(chatId, addedMessage.ChatId);
        Assert.Equal(senderId, addedMessage.SenderId);
        Assert.Equal(text, addedMessage.Text);

        Assert.Equal(addedMessage.Id, act.Id);
        Assert.Equal(chatId, act.ChatId);
        Assert.Equal(senderId, act.SenderId);
        Assert.Equal(text, act.Text);
        Assert.Equal(MessageStatus.Sent, act.Status);
        Assert.Empty(act.Reactions);
        Assert.Null(act.ReplyTo);

        messagesRepository.Verify(r => r.Add(It.IsAny<Message>()), Times.Once);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);

        chatMembersRepository.Verify(
            r => r.MarkAsRead(chatId, senderId, addedMessage.Id, 0),
            Times.Once);

        chatMembersRepository.Verify(
            r => r.IncrementUnreadCount(chatId, senderId),
            Times.Once);
    }

    [Fact]
    public async Task Send_WhenReplyMessageBelongsToAnotherChat_ThrowsInvalidReplyMessageException()
    {
        var chatId = Guid.NewGuid();
        var otherChatId = Guid.NewGuid();
        var senderId = Guid.NewGuid();
        var parentMessageId = Guid.NewGuid();

        var parentMessage = Message.Restore(parentMessageId, otherChatId, Guid.NewGuid(), "original message", DateTimeOffset.UtcNow, null, null);

        var usersRepository = new Mock<IUsersRepository>();
        var messagesRepository = new Mock<IMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(parentMessageId))
            .ReturnsAsync(parentMessage);

        var service = CreateService(
            usersRepository: usersRepository,
            messagesRepository: messagesRepository,
            unitOfWork: unitOfWork);

        var act = () => service.Send(chatId, senderId, "reply", parentMessageId);

        await Assert.ThrowsAsync<InvalidReplyMessageException>(act);

        messagesRepository.Verify(
            r => r.Add(It.IsAny<Message>()), 
            Times.Never);

        usersRepository.Verify(
            r => r.GetDisplayName(It.IsAny<Guid>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task Send_WhenReplyMessageBelongsToSameChat_ReturnsReplyPreview()
    {
        var chatId = Guid.NewGuid();
        var senderId = Guid.NewGuid();
        var parentMessageId = Guid.NewGuid();
        var parentSenderId = Guid.NewGuid();

        var parentMessage = Message.Restore(parentMessageId, chatId, parentSenderId, "original message", DateTimeOffset.UtcNow, null, null);

        var usersRepository = new Mock<IUsersRepository>();
        var messagesRepository = new Mock<IMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(parentMessageId))
            .ReturnsAsync(parentMessage);

        usersRepository
            .Setup(r => r.GetDisplayName(parentSenderId))
            .ReturnsAsync("parent sender");

        messagesRepository
            .Setup(r => r.Add(It.IsAny<Message>()))
            .Returns(Task.CompletedTask);

        var service = CreateService(
            messagesRepository: messagesRepository,
            usersRepository: usersRepository,
            unitOfWork: unitOfWork
        );

        var act = await service.Send(chatId, senderId, "reply", parentMessageId);

        Assert.Equal("reply", act.Text);
        Assert.NotNull(act.ReplyTo);
        Assert.Equal(parentMessageId, act.ReplyTo.Id);
        Assert.Equal("parent sender", act.ReplyTo.SenderName);
        Assert.Equal("original message", act.ReplyTo.Text);

        messagesRepository.Verify(
            r => r.Add(It.Is<Message>(m => 
                m.ChatId == chatId &&
                m.SenderId == senderId &&
                m.ReplyToMessageId == parentMessageId)),
            Times.Once);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task SetReaction_WhenSameReactionExists_RemovesReaction()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var reactionId = Guid.NewGuid();
        var emoji = "👍";

        var existingReaction = MessageReaction.Restore(reactionId, messageId, userId, emoji, DateTimeOffset.UtcNow);

        var reactionsRepository = new Mock<IMessageReactionsRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        reactionsRepository
            .Setup(r => r.GetByMessageIdAndUserId(messageId, userId))
            .ReturnsAsync(existingReaction);

        var service = CreateService(
            reactionsRepository: reactionsRepository,
            unitOfWork: unitOfWork);

        await service.SetReaction(messageId, userId, emoji);

        reactionsRepository.Verify(
            r => r.Remove(reactionId), 
            Times.Once);

        reactionsRepository.Verify(
            r => r.Add(It.IsAny<MessageReaction>()), 
            Times.Never);

        reactionsRepository.Verify(
            r => r.Update(It.IsAny<MessageReaction>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task SetReaction_WhenNoReactionExists_AddsReaction()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var emoji = "👍";

        var reactionsRepository = new Mock<IMessageReactionsRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        reactionsRepository
            .Setup(r => r.GetByMessageIdAndUserId(messageId, userId))
            .ReturnsAsync((MessageReaction?)null);

        var service = CreateService(
            reactionsRepository: reactionsRepository,
            unitOfWork: unitOfWork);

        await service.SetReaction(messageId, userId, emoji);

        reactionsRepository.Verify(
            r => r.Add(It.Is<MessageReaction>(mr => 
                mr.MessageId == messageId && 
                mr.UserId == userId && 
                mr.Emoji == emoji)), 
            Times.Once);

        reactionsRepository.Verify(
            r => r.Remove(It.IsAny<Guid>()), 
            Times.Never);

        reactionsRepository.Verify(
            r => r.Update(It.IsAny<MessageReaction>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task SetReaction_WhenDifferentReactionExists_UpdatesReaction()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var existingReactionId = Guid.NewGuid();
        var existingEmoji = "👍";
        var newEmoji = "❤️";

        var existingReaction = MessageReaction.Restore(existingReactionId, messageId, userId, existingEmoji, DateTimeOffset.UtcNow);

        var reactionsRepository = new Mock<IMessageReactionsRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        reactionsRepository
            .Setup(r => r.GetByMessageIdAndUserId(messageId, userId))
            .ReturnsAsync(existingReaction);

        var service = CreateService(
            reactionsRepository: reactionsRepository,
            unitOfWork: unitOfWork
        );

        await service.SetReaction(messageId, userId, newEmoji);

        reactionsRepository.Verify(
            r => r.Update(It.Is<MessageReaction>(mr => 
                mr.Id == existingReactionId && 
                mr.Emoji == newEmoji)), 
            Times.Once);

        reactionsRepository.Verify(
            r => r.Add(It.IsAny<MessageReaction>()), 
            Times.Never);

        reactionsRepository.Verify(
            r => r.Remove(It.IsAny<Guid>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteForEveryone_WhenUserHasNoAccess_ThrowsException()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(false);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            unitOfWork: unitOfWork);

        await Assert.ThrowsAsync<ChatAccessDeniedException>(() => service.DeleteForEveryone(messageId, userId));

        messagesRepository.Verify(
            r => r.DeleteForEveryone(
                It.IsAny<Message>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task DeleteForEveryone_WhenUserHasAccess_DeletesMessageUnpinsAndSaves()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, userId, "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            chatMembersRepository: chatMembersRepository,
            unitOfWork: unitOfWork);

        await service.DeleteForEveryone(messageId, userId);

        messagesRepository.Verify(
            r => r.DeleteForEveryone(
                It.Is<Message>(m => m.Id == messageId && m.IsDeleted),
                It.IsAny<CancellationToken>()),
            Times.Once);

        messagesRepository.Verify(
            r => r.DeleteForEveryone(message, It.IsAny<CancellationToken>()), 
            Times.Once);

        pinnedMessagesRepository.Verify(
            r => r.UnpinMessage(messageId, It.IsAny<CancellationToken>()), 
            Times.Once);
        
        Assert.True(message.IsDeleted);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteForEveryone_WhenMessageAlreadyDeleted_DoesNothing()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, userId, "message", DateTimeOffset.UtcNow, null, null);

        message.Delete(DateTimeOffset.UtcNow);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        await service.DeleteForEveryone(messageId, userId);

        messagesRepository.Verify(
            r => r.DeleteForEveryone(
                It.IsAny<Message>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        pinnedMessagesRepository.Verify(
            r => r.UnpinMessage(
                It.IsAny<Guid>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task DeleteForUser_WhenUserHasNoAccess_ThrowsException()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(false);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            unitOfWork: unitOfWork);

        await Assert.ThrowsAsync<ChatAccessDeniedException>(() => service.DeleteForUser(messageId, userId));

        messagesRepository.Verify(
            r => r.DeleteForUser(
                It.IsAny<Guid>(), 
                It.IsAny<Guid>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task DeleteForUser_WhenUserHasAccess_DeletesMessageAndSaves()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, userId, "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            unitOfWork: unitOfWork);

        await service.DeleteForUser(messageId, userId);

        messagesRepository.Verify(
            r => r.DeleteForUser(
                It.Is<Guid>(id => id == userId), 
                It.Is<Guid>(id => id == messageId), 
                It.IsAny<CancellationToken>()), 
            Times.Once);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task PinMessage_WhenUserHasNoAccess_ThrowsException()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(false);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        await Assert.ThrowsAsync<ChatAccessDeniedException>(() => service.PinMessage(messageId, userId));

        pinnedMessagesRepository.Verify(
            r => r.PinMessage(
                It.IsAny<PinnedMessage>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task PinMessage_WhenMessageIsDeleted_ReturnsNull()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        message.Delete(DateTimeOffset.UtcNow);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        var result = await service.PinMessage(messageId, userId);

        Assert.Null(result);

        pinnedMessagesRepository.Verify(
            r => r.PinMessage(
                It.IsAny<PinnedMessage>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task PinMessage_WhenAlreadyPinned_ReturnsNull()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        pinnedMessagesRepository
            .Setup(r => r.IsPinned(messageId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        var result = await service.PinMessage(messageId, userId);

        Assert.Null(result);

        pinnedMessagesRepository.Verify(
            r => r.PinMessage(
                It.IsAny<PinnedMessage>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task PinMessage_WhenValid_PinsMessageAndReturnsDto()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        pinnedMessagesRepository
            .Setup(r => r.IsPinned(messageId))
            .ReturnsAsync(false);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        var result = await service.PinMessage(messageId, userId);

        Assert.NotNull(result);
        Assert.Equal(messageId, result.MessageId);
        Assert.Equal(userId, result.PinnedByUserId);
        Assert.Equal(chatId, result.ChatId);
        Assert.Equal("message", result.Text);

        pinnedMessagesRepository.Verify(
            r => r.PinMessage(
                It.Is<PinnedMessage>(pm => 
                    pm.MessageId == messageId && 
                    pm.PinnedByUserId == userId), 
                It.IsAny<CancellationToken>()), 
            Times.Once);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UnpinMessage_WhenUserHasNoAccess_ThrowsException()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(false);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        await Assert.ThrowsAsync<ChatAccessDeniedException>(() => service.UnpinMessage(messageId, userId));

        pinnedMessagesRepository.Verify(
            r => r.UnpinMessage(
                It.IsAny<Guid>(), 
                It.IsAny<CancellationToken>()), 
            Times.Never);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task UnpinMessage_WhenUserHasAccess_UnpinsMessageAndSaves()
    {
        var messageId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var chatId = Guid.NewGuid();

        var message = Message.Restore(messageId, chatId, Guid.NewGuid(), "message", DateTimeOffset.UtcNow, null, null);

        var messagesRepository = new Mock<IMessagesRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();
        var unitOfWork = new Mock<IUnitOfWork>();

        messagesRepository
            .Setup(r => r.GetById(messageId))
            .ReturnsAsync(message);

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository,
            unitOfWork: unitOfWork);

        await service.UnpinMessage(messageId, userId);

        pinnedMessagesRepository.Verify(
            r => r.UnpinMessage(
                It.Is<Guid>(id => id == messageId), 
                It.IsAny<CancellationToken>()), 
            Times.Once);

        unitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetPinnedMessages_WhenUserHasNoAccess_ThrowsException()
    {
        var chatId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>(); 

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(false);

        var service = CreateService(
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository);

        await Assert.ThrowsAsync<ChatAccessDeniedException>(() => service.GetPinnedMessagesByChatId(chatId, userId));

        pinnedMessagesRepository.Verify(
            r => r.GetByChatId(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()), 
            Times.Never);

        chatMembersRepository.Verify(
            r => r.HasAccess(chatId, userId), 
            Times.Once);
    }

    [Fact]
    public async Task GetPinnedMessages_WhenUserHasAccess_ReturnsPinnedMessages()
    {
        var chatId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var cancellationToken = CancellationToken.None;

        var pinnedMessages = new List<PinnedMessage>
        {
            PinnedMessage.Restore(Guid.NewGuid(), Guid.NewGuid(), userId, DateTimeOffset.UtcNow),
            PinnedMessage.Restore(Guid.NewGuid(), Guid.NewGuid(), userId, DateTimeOffset.UtcNow)
        };

        var chatMembersRepository = new Mock<IChatMembersRepository>();
        var pinnedMessagesRepository = new Mock<IPinnedMessagesRepository>();

        chatMembersRepository
            .Setup(r => r.HasAccess(chatId, userId))
            .ReturnsAsync(true);

        pinnedMessagesRepository
            .Setup(r => r.GetByChatId(chatId, userId, cancellationToken))
            .ReturnsAsync(pinnedMessages);

        var service = CreateService(
            chatMembersRepository: chatMembersRepository,
            pinnedMessagesRepository: pinnedMessagesRepository);

        var result = await service.GetPinnedMessagesByChatId(chatId, userId, cancellationToken);

        Assert.Equal(2, result.Count);
        Assert.Equal(
            pinnedMessages.Select(pm => pm.Id),
            result.Select(pm => pm.Id));

        chatMembersRepository.Verify(
            r => r.HasAccess(chatId, userId), 
            Times.Once);

        pinnedMessagesRepository.Verify(
            r => r.GetByChatId(chatId, userId, cancellationToken), 
            Times.Once);
    }

    [Fact]
    public async Task GetMessageReactions_WhenMessageExists_ReturnsReactions()
    {
        var messageId = Guid.NewGuid();
        var currentUserId = Guid.NewGuid();
        var reactions = new List<MessageReaction>
        {
            MessageReaction.Restore(Guid.NewGuid(), messageId, Guid.NewGuid(), "👍", DateTimeOffset.UtcNow),
            MessageReaction.Restore(Guid.NewGuid(), messageId, currentUserId, "❤️", DateTimeOffset.UtcNow),
            MessageReaction.Restore(Guid.NewGuid(), messageId, Guid.NewGuid(), "❤️", DateTimeOffset.UtcNow)
        };

        var reactionsRepository = new Mock<IMessageReactionsRepository>();

        reactionsRepository
            .Setup(r => r.GetByMessageId(messageId))
            .ReturnsAsync(reactions);

        var service = CreateService(
            reactionsRepository: reactionsRepository);

        var result = await service.GetMessageReactions(messageId, currentUserId);

        Assert.Equal(2, result.Count);

        var thumbsUp = Assert.Single(result, r => r.Emoji == "👍");
        Assert.Equal(1, thumbsUp.Count);
        Assert.False(thumbsUp.IsOwn);

        var heart = Assert.Single(result, r => r.Emoji == "❤️");
        Assert.Equal(2, heart.Count);
        Assert.True(heart.IsOwn);

        reactionsRepository.Verify(
            r => r.GetByMessageId(messageId), 
            Times.Once);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(-10, 1)]
    [InlineData(50, 50)]
    [InlineData(101, 100)]
    public async Task GetByChatId_ClampsPageSize(int requestedPageSize, int expectedPageSize)
    {
        var chatId = Guid.NewGuid();
        var currentUserId = Guid.NewGuid();
        var beforeMessageId = (Guid?)null;
        var cancellationToken = CancellationToken.None;

        var messagesRepository = new Mock<IMessagesRepository>();
        var reactionsRepository = new Mock<IMessageReactionsRepository>();
        var chatMembersRepository = new Mock<IChatMembersRepository>();

        messagesRepository
            .Setup(r => r.GetPageByChatId(chatId, currentUserId, It.IsAny<Guid?>(), It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((new List<Message>(), false));

        messagesRepository
            .Setup(r => r.GetReplyPreviews(It.IsAny<List<Guid>>(), currentUserId, cancellationToken))
            .ReturnsAsync(new Dictionary<Guid, ReplyMessageDto>());

        reactionsRepository
            .Setup(r => r.GetByMessageIds(It.IsAny<List<Guid>>()))
            .ReturnsAsync(new List<MessageReaction>());

        chatMembersRepository
            .Setup(r => r.GetOtherUserLastReadMessageId(chatId, currentUserId))
            .ReturnsAsync((Guid?)null);

        var service = CreateService(
            messagesRepository: messagesRepository,
            chatMembersRepository: chatMembersRepository,
            reactionsRepository: reactionsRepository);

        await service.GetByChatId(currentUserId, chatId, beforeMessageId, requestedPageSize, cancellationToken);

        messagesRepository.Verify(
            r => r.GetPageByChatId(chatId, currentUserId, null, expectedPageSize, cancellationToken), 
            Times.Once);
    }

    private MessagesService CreateService(
        Mock<IUsersRepository>? usersRepository = null,
        Mock<IMessagesRepository>? messagesRepository = null,
        Mock<IChatMembersRepository>? chatMembersRepository = null,
        Mock<IMessageReactionsRepository>? reactionsRepository = null,
        Mock<IPinnedMessagesRepository>? pinnedMessagesRepository = null,
        Mock<IUnitOfWork>? unitOfWork = null)
    {
        return new MessagesService(
            (usersRepository ?? new()).Object,
            (messagesRepository ?? new()).Object,
            (chatMembersRepository ?? new()).Object,
            (reactionsRepository ?? new()).Object,
            (pinnedMessagesRepository ?? new()).Object,
            (unitOfWork ?? new()).Object);
    }
}
