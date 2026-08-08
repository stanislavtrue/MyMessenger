using Chat.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Chat.Infrastructure.Persistence.Configurations;
public class ChatRoomConfiguration : IEntityTypeConfiguration<ChatRoomEntity>
{
    public void Configure(EntityTypeBuilder<ChatRoomEntity> builder)
    {
        builder.HasKey(cr => cr.Id);

        builder.Property(cr => cr.Name)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(cr => cr.CreatedAt)
            .IsRequired();
    }
}
