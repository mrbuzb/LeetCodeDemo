using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface ISubmissionService
{
    Task<SubmissionUpdateDto> GetByIdAsync(long id);
    Task<List<SubmissionUpdateDto>> GetByUserIdAsync(long userId);
    Task<List<SubmissionUpdateDto>> GetByProblemIdAsync(long problemId);
    Task<SubmissionResultDto> AddAsync(SubmissionDto submission,long userId);
    Task UpdateAsync(SubmissionUpdateDto submission);
    Task DeleteAsync(long id);
}