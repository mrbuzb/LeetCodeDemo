using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Repositories;

public class ProblemRepository(AppDbContext _context) : IProblemRepository
{
    public async Task<long> AddAsync(Problem problem)
    {
        await _context.Problems.AddAsync(problem);
        await _context.SaveChangesAsync();
        return problem.Id;
    }

    public async Task DeleteAsync(long problemId,long id)
    {
        var problem = await GetByIdAsync(problemId);
        if(problem.CreatorId != id)
        {
            throw new NotAllowedException($"This is not your problem");
        }
        _context.Problems.Remove(problem);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Problem>> GetAllAsync()
    {
        return await _context.Problems.Include(x=>x.TestCases).ToListAsync();
    }

    public async Task<List<Problem>> GetByDifficultyAsync(Difficulty difficulty)
    {
        return await _context.Problems.Where(x=>x.Difficulty == difficulty).ToListAsync();
    }

    public async Task<Problem> GetByIdAsync(long id)
    {
        var problem =await _context.Problems.Include(x=>x.TestCases).FirstOrDefaultAsync(x=>x.Id == id);
        if(problem == null)
        {
            throw new EntityNotFoundException($"{id}");
        }
        return problem;
    }

    public async Task<List<Problem>> SearchAsync(string keyword)
    {
        return await _context.Problems.Where(x => x.Tags.Contains(keyword)).ToListAsync();
    }

    public async Task UpdateAsync(Problem problem)
    {
        _context.Problems.Update(problem);
        await _context.SaveChangesAsync();
    }
}
