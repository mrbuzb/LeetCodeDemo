using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface IUserStatsServise
{
    Task<List<UserStatsDto>> GetTopWeeklyAsync();
    Task<List<UserStatsDto>> GetTopMonthlyAsync();
    Task<List<UserStatsDto>> GetTopAllTimeAsync();
}