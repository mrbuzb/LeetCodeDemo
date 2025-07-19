using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LeetCode.Infrastructure.Persistence.ConfigurationsPS;

public class ConfirmerConfiguration : IEntityTypeConfiguration<UserConfirme>
{
    public void Configure(EntityTypeBuilder<UserConfirme> builder)
    {
        builder.ToTable("Confirmers");

        builder.HasKey(uc => uc.ConfirmerId);

        builder.Property(uc => uc.ConfirmingCode)
            .IsRequired(false)
            .HasMaxLength(6);

        builder.HasIndex(uc => uc.Gmail)
            .IsUnique();

        builder.Property(uc => uc.ExpiredDate)
            .IsRequired()
            .HasDefaultValueSql("NOW() + interval '10 minutes'");

        builder.Property(uc => uc.IsConfirmed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasOne(uc => uc.User)
            .WithOne(u => u.Confirmer)
            .HasForeignKey<UserConfirme>(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
