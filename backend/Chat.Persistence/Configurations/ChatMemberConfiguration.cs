using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chat.Persistence.Configurations;
public class ChatMemberConfiguration : IEntityTypeConfiguration<ChatMemberEntity>
{
    public void Configure(EntityTypeBuilder<ChatMemberEntity> builder)
    {
        builder.HasKey(cm => cm.Id);

        builder.HasIndex(cm => cm.ChatId);
        builder.HasIndex(cm => cm.UserId);

        builder.HasOne(cm => cm.ChatRoom)
            .WithMany(cr => cr.Members)
            .HasForeignKey(cm => cm.ChatId);

        builder.HasOne(cm => cm.User)
            .WithMany(u => u.ChatMembers)
            .HasForeignKey(cm => cm.UserId);

        builder.Property(cm => cm.LastReadMessageId)
            .IsRequired(false);

        builder.Property(cm => cm.UnreadCount)
            .IsRequired()
            .HasDefaultValue(0);
    }
}
