using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Problem> Problems { get; set; }
    public DbSet<Submission> Submissions { get; set; }
    public DbSet<TestCase> TestCases { get; set; }
    public DbSet<UserConfirme> Confirmers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<UserStats> UserStats { get; set; }


    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
