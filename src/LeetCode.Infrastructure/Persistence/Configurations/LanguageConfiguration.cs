using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Configurations;

public class LanguageConfiguration : IEntityTypeConfiguration<Language>
{
    public void Configure(EntityTypeBuilder<Language> builder)
    {
        builder.ToTable("Languages");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(l => l.Judge0Id)
               .IsRequired();

        builder.HasMany(l => l.Submissions)
               .WithOne(s => s.Language)
               .HasForeignKey(s => s.LanguageId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
