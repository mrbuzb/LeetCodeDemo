using LeetCode.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Api.Configurations;

public static class DatabaseConfigurations
{
    public static void ConfigureDataBase(this WebApplicationBuilder builder)
    {
        var connectionStringMs = builder.Configuration.GetConnectionString("DatabaseConnectionMS");
        
        builder.Services.AddDbContext<AppDbContextMS>(options =>
          options.UseSqlServer(connectionStringMs));

        var connectionStringPs = builder.Configuration.GetConnectionString("DatabaseConnectionPS");

        builder.Services.AddDbContext<AppDbContextPS>(options =>
          options.UseNpgsql(connectionStringPs));
    }
}
