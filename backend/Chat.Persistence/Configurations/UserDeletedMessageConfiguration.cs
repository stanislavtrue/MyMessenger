using Chat.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chat.Persistence.Configurations;
public class UserDeletedMessageConfiguration : IEntityTypeConfiguration<UserDeletedMessageEntity>
{
    public void Configure(EntityTypeBuilder<UserDeletedMessageEntity> builder)
    {
        builder.HasKey(udm => udm.Id);

        builder.HasIndex(udm => new { udm.UserId, udm.MessageId })
            .IsUnique();

        builder.HasOne(udm => udm.Message)
            .WithMany()
            .HasForeignKey(udm => udm.MessageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(udm => udm.User)
            .WithMany()
            .HasForeignKey(udm => udm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
