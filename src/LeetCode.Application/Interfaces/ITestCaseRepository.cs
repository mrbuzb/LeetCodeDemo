using LeetCode.Domain.Entities;

namespace LeetCode.Application.Interfaces;

public interface ITestCaseRepository
{
    Task<TestCase> GetByIdAsync(long id);
    Task<List<TestCase>> GetByProblemIdAsync(long problemId);
    Task<long> AddAsync(TestCase testCase);
    Task UpdateAsync(TestCase testCase);
    Task DeleteAsync(long id);
}
