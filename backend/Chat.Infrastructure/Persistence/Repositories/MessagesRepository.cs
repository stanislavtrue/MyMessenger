using Chat.Domain.Interfaces;
using Chat.Domain.Models;
using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.Infrastructure.Persistence.Repositories;
public class MessagesRepository : IMessagesRepository
{
    private readonly ChatDbContext _context;

    public MessagesRepository(ChatDbContext context)
    {
        _context = context;
    }

    public async Task Add(Message message)
    {
        var messageEntity = new MessageEntity
        {
            Id = message.Id,
            ChatId = message.ChatId,
            SenderId = message.SenderId,
            Text = message.Text,
            SentAt = message.SentAt
        };

        await _context.Messages.AddAsync(messageEntity);
    }

    public async Task<List<Message>> GetByChatId(Guid chatId)
    {
        var messageEntities = await _context.Messages
            .AsNoTracking()
            .Where(m => m.ChatId == chatId)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        var messages = new List<Message>();

        foreach (var messageEntity in messageEntities)
        {
            messages.Add(Message.Restore(
                messageEntity.Id,
                messageEntity.ChatId,
                messageEntity.SenderId,
                messageEntity.Text,
                messageEntity.SentAt
            ));
        }

        return messages;
    }
}
