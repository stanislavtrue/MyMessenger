using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chat.Persistence.Configurations;
public class MessageReactionConfiguration : IEntityTypeConfiguration<MessageReactionEntity>
{
    public void Configure(EntityTypeBuilder<MessageReactionEntity> builder)
    {
        builder.HasKey(mr => mr.Id);

        builder.Property(mr => mr.MessageId)
            .IsRequired();

        builder.Property(mr => mr.UserId)
            .IsRequired();

        builder.HasIndex(mr => new { mr.MessageId, mr.UserId })
            .IsUnique();

        builder.Property(mr => mr.Emoji)
            .IsRequired()
            .HasMaxLength(16);

        builder.Property(mr => mr.CreatedAt)
            .IsRequired();

        builder.HasOne(mr => mr.Message)
            .WithMany(m => m.Reactions)
            .HasForeignKey(mr => mr.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mr => mr.User)
            .WithMany()
            .HasForeignKey(mr => mr.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
