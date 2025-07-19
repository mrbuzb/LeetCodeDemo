using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Repositories;

public class SubmissionRepository(AppDbContextMS _context) : ISubmissionRepository
{
    public async Task<long> AddAsync(Submission submission)
    {
        await _context.Submissions.AddAsync(submission);
        await _context.SaveChangesAsync();
        return submission.Id;
    }

    public async Task DeleteAsync(long id)
    {
        var submission = await GetByIdAsync(id);
        _context.Submissions.Remove(submission);
        await _context.SaveChangesAsync();
    }

    public async Task<Submission> GetByIdAsync(long id)
    {
        var submission =await _context.Submissions.FirstOrDefaultAsync(s => s.Id == id);
        if(submission is null)
        {
            throw new EntityNotFoundException($"{id}");
        }
        return submission;
    }

    public async Task<List<Submission>> GetByProblemIdAsync(long problemId)
    {
        return await _context.Submissions.Where(x=>x.ProblemId == problemId).ToListAsync();
    }

    public async Task<List<Submission>> GetByUserIdAsync(long userId)
    {
        return await _context.Submissions.Where(x => x.UserId == userId).ToListAsync();
    }

    public async Task UpdateAsync(Submission submission)
    {
        _context.Submissions.Update(submission);
        await _context.SaveChangesAsync();
    }
}
