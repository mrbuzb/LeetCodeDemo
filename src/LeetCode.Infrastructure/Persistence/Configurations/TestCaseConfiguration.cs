using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LeetCode.Infrastructure.Persistence.Configurations;

internal class TestCaseConfiguration : IEntityTypeConfiguration<TestCase>
{
    public void Configure(EntityTypeBuilder<TestCase> builder)
    {
        builder.ToTable("TestCases");

        builder.HasKey(tc => tc.Id);

        builder.Property(tc => tc.Input).IsRequired();
        builder.Property(tc => tc.Expected).IsRequired();
        builder.Property(tc => tc.IsSample).IsRequired();

        builder.HasOne(tc => tc.Problem)
               .WithMany(p => p.TestCases)
               .HasForeignKey(tc => tc.ProblemId);
    }
}