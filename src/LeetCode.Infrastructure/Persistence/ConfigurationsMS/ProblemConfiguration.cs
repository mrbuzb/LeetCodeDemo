using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LeetCode.Infrastructure.Persistence.ConfigurationsMS;

internal class ProblemConfiguration : IEntityTypeConfiguration<Problem>
{
    public void Configure(EntityTypeBuilder<Problem> builder)
    {
        builder.ToTable("Problems");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .ValueGeneratedOnAdd();

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(p => p.Description)
            .IsRequired();

        builder.Property(p => p.Tags)
            .HasMaxLength(200);

        builder.Property(p => p.Difficulty)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("GETDATE()");

        builder.HasMany(p => p.TestCases)
            .WithOne(tc => tc.Problem)
            .HasForeignKey(tc => tc.ProblemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Submissions)
            .WithOne(s => s.Problem)
            .HasForeignKey(s => s.ProblemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
