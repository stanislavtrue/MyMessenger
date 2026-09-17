using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chat.Persistence.Configurations;
public class PinnedMessageConfiguration : IEntityTypeConfiguration<PinnedMessageEntity>
{
    public void Configure(EntityTypeBuilder<PinnedMessageEntity> builder)
    {
        builder.HasKey(pm => pm.Id);

        builder.HasIndex(pm => pm.MessageId)
            .IsUnique();

        builder.HasOne(pm => pm.Message)
            .WithOne()
            .HasForeignKey<PinnedMessageEntity>(pm => pm.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pm => pm.PinnedByUser)
            .WithMany()
            .HasForeignKey(pm => pm.PinnedByUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
