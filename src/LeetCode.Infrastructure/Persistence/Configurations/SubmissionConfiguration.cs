using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LeetCode.Infrastructure.Persistence.Configurations;

internal class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.ToTable("Submissions");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Code).IsRequired();
        builder.Property(s => s.Status).HasMaxLength(50);
        builder.Property(s => s.TimeUsed).IsRequired();
        builder.Property(s => s.MemoryUsed).IsRequired();
        builder.Property(s => s.SubmittedAt).IsRequired();

        builder.HasOne(s => s.User)
               .WithMany(u => u.Submissions)
               .HasForeignKey(s => s.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Problem)
               .WithMany(p => p.Submissions)
               .HasForeignKey(s => s.ProblemId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.Language)
               .WithMany(l => l.Submissions)
               .HasForeignKey(s => s.LanguageId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
