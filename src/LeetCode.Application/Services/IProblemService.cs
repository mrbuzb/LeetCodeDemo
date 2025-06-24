using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface IProblemService
{
    Task<ProblemUpdateDto> GetByIdAsync(long id);
    Task<List<ProblemUpdateDto>> GetAllAsync();
    Task<List<ProblemUpdateDto>> GetByDifficultyAsync(Difficulty difficulty);
    Task<List<ProblemUpdateDto>> SearchAsync(string keyword);
    Task<long> AddAsync(ProblemDto problem,long creatorId);
    Task UpdateAsync(ProblemUpdateDto problem, long creatorId);
    Task DeleteAsync(long problemId,long id);
}