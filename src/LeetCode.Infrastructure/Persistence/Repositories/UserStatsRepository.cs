using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Repositories;

public class UserStatsRepository(AppDbContext _context) : IUserStatsRepository
{
    public async Task AddAsync(UserStats stats)
    {
        await _context.UserStats.AddAsync(stats);
        await _context.SaveChangesAsync();
    }

    public async Task<UserStats> GetByUserIdAsync(long userId)
    {
        var stats = await _context.UserStats.FirstOrDefaultAsync(x => x.UserId == userId);
        if (stats is null)
        {
            throw new EntityNotFoundException($"User id {userId}");
        }
        return stats;
    }

    public async Task<List<UserStats>> GetTopAllTimeAsync()
    {
        return await _context.UserStats
            .OrderByDescending(x => x.SolvedCount)
            .Include(x => x.User)
            .Take(3)
            .ToListAsync();
    }

    public async Task<List<UserStats>> GetTopMonthlyAsync()
    {
        var fromDate = DateTime.UtcNow.AddDays(-30);
        return await _context.UserStats
            .Where(x => x.UpdatedAt >= fromDate)
            .OrderByDescending(x => x.SolvedCount)
            .Include(x => x.User)
            .Take(3)
            .ToListAsync();
    }

    public async Task<List<UserStats>> GetTopWeeklyAsync()
    {
        return await _context.UserStats
            .OrderByDescending(x => x.SolvedCount)
            .Include(x => x.User)
            .Take(3)
            .ToListAsync();
    }

    public async Task UpdateAsync(UserStats stats)
    {
        _context.UserStats.Update(stats);
        await _context.SaveChangesAsync();
    }
}
