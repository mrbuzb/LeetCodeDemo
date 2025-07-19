using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public class TestCaseService(ITestCaseRepository _repo) : ITestCaseService
{
    public async Task<long> AddAsync(TestCaseDto testCase)
    {
        return await _repo.AddAsync(Converter(testCase));
    }

    public async Task DeleteAsync(long id)
    {
        await _repo.DeleteAsync(id);
    }

    public async Task<TestCaseUpdateDto> GetByIdAsync(long id)
    {
        var testCase = await _repo.GetByIdAsync(id);
        return Converter(testCase);
    }

    public async Task<List<TestCaseUpdateDto>> GetByProblemIdAsync(long problemId)
    {
        var testCases = await _repo.GetByProblemIdAsync(problemId);
        return testCases.Select(Converter).ToList();
    }

    public async Task UpdateAsync(TestCaseUpdateDto testCase)
    {
        var foundTestCase = await _repo.GetByIdAsync(testCase.Id);
        foundTestCase.Input = testCase.Input;
        foundTestCase.IsSample = testCase.IsSample;
        foundTestCase.ProblemId = testCase.ProblemId;
        foundTestCase.Expected = testCase.Expected;
        await _repo.UpdateAsync(foundTestCase);
    }

    private TestCase Converter(TestCaseDto testCase)
    {
        return new TestCase
        {
            Expected = testCase.Expected,
            Input = testCase.Input,
            IsSample = testCase.IsSample,
            ProblemId = testCase.ProblemId,
        };
    }

    private TestCaseUpdateDto Converter(TestCase testCase)
    {
        return new TestCaseUpdateDto
        {
            Id = testCase.Id,
            Expected = testCase.Expected,
            Input = testCase.Input,
            IsSample = testCase.IsSample,
            ProblemId = testCase.ProblemId,
        };
    }
}
