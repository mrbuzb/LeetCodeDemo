using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LeetCode.Infrastructure.Persistence.Repositories;

public class LanguageRepository(AppDbContext _context) : ILanguageRepository
{
    public async Task<List<Language>> GetAllAsync()
    {
        return await _context.Languages.ToListAsync();
    }

    public async Task<Language> GetByIdAsync(long id)
    {
        var language =await _context.Languages.FirstOrDefaultAsync(x => x.Id == id);
        if(language == null)
        {
            throw new EntityNotFoundException($"{id}");
        }
        return language;
    }

    public async Task<Language> GetByJudge0IdAsync(int judge0Id)
    {
        var language = await _context.Languages.FirstOrDefaultAsync(x => x.Judge0Id == judge0Id);
        if (language == null)
        {
            throw new EntityNotFoundException($"{judge0Id}");
        }
        return language;
    }
}
