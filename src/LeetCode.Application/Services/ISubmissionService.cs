using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface ISubmissionService
{
    Task<SubmissionDto> GetByIdAsync(long id);
    Task<List<SubmissionDto>> GetByUserIdAsync(long userId);
    Task<List<SubmissionDto>> GetByProblemIdAsync(long problemId);
    Task AddAsync(SubmissionDto submission);
    Task UpdateAsync(SubmissionDto submission);
    Task DeleteAsync(long id);
}