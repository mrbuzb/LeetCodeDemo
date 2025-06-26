using LeetCode.Domain.Entities;

namespace LeetCode.Application.Interfaces;

public interface IUserStatsRepository
{
    Task<UserStats> GetByUserIdAsync(long userId);
    Task AddAsync(UserStats stats);
    Task UpdateAsync(UserStats stats);
    Task<List<UserStats>> GetTopWeeklyAsync();
    Task<List<UserStats>> GetTopMonthlyAsync();
    Task<List<UserStats>> GetTopAllTimeAsync();
}
