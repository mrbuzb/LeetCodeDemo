using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface ITestCaseService
{
    Task<TestCaseUpdateDto> GetByIdAsync(long id);
    Task<List<TestCaseUpdateDto>> GetByProblemIdAsync(long problemId);
    Task<long> AddAsync(TestCaseDto testCase);
    Task UpdateAsync(TestCaseUpdateDto testCase);
    Task DeleteAsync(long id);
}