using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence;

public class AppDbContextPS : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserConfirme> Confirmers { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }


    public AppDbContextPS(DbContextOptions<AppDbContextPS> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
        typeof(AppDbContextMS).Assembly,
        t => t.Namespace == "LeetCode.Infrastructure.Persistence.ConfigurationsPS"
    );
    }
}
