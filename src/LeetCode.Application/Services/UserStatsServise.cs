using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public class UserStatsServise(IUserStatsRepository _repo) : IUserStatsServise
{
    public async Task<List<UserStatsDto>> GetTopAllTimeAsync()
    {
        var stats = await _repo.GetTopAllTimeAsync();
        return stats.Select(Converter).ToList();
    }

    public async Task<List<UserStatsDto>> GetTopMonthlyAsync()
    {
        var stats = await _repo.GetTopMonthlyAsync();
        return stats.Select(Converter).ToList();
    }

    public async Task<List<UserStatsDto>> GetTopWeeklyAsync()
    {
        var stats = await _repo.GetTopWeeklyAsync();
        return stats.Select(Converter).ToList();
    }
    private UserStatsDto Converter(UserStats stats)
    {
        return new UserStatsDto
        {
            Accuracy = stats.Accuracy,
            Id = stats.Id,
            SolvedCount = stats.SolvedCount,
            TotalSubmits = stats.TotalSubmits,
            UpdatedAt = stats.UpdatedAt,
            UserName = stats.User.UserName,
        };
    }
}
