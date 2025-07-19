using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence;

public class AppDbContextMS : DbContext
{
    public DbSet<Language> Languages { get; set; }
    public DbSet<Problem> Problems { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<TestCase> TestCases { get; set; }
    public DbSet<UserStats> UserStats { get; set; }


    public AppDbContextMS(DbContextOptions<AppDbContextMS> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
        typeof(AppDbContextMS).Assembly,
        t => t.Namespace == "LeetCode.Infrastructure.Persistence.ConfigurationsMS"
    );



    }
}
