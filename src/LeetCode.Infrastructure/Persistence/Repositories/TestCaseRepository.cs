using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Repositories;

public class TestCaseRepository(AppDbContextMS _context) : ITestCaseRepository
{
    public async Task<long> AddAsync(TestCase testCase)
    {
        await _context.TestCases.AddAsync(testCase);
        await _context.SaveChangesAsync();
        return testCase.Id;
    }

    public async Task DeleteAsync(long id)
    {
        var testCase =await GetByIdAsync(id);
        _context.TestCases.Remove(testCase);
        await _context.SaveChangesAsync();
    }

    public async Task<TestCase> GetByIdAsync(long id)
    {
        var testCase =await _context.TestCases.FirstOrDefaultAsync(x=>x.Id == id);
        if(testCase is null)
        {
            throw new EntityNotFoundException($"{id}");
        }
        return testCase;
    }

    public Task<List<TestCase>> GetByProblemIdAsync(long problemId)
    {
        return _context.TestCases.Where(x=>x.ProblemId == problemId).ToListAsync();
    }

    public async Task UpdateAsync(TestCase testCase)
    {
        _context.TestCases.Update(testCase);
        await _context.SaveChangesAsync();
    }
}
