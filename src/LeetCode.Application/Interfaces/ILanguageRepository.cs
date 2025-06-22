using LeetCode.Domain.Entities;

namespace LeetCode.Application.Interfaces;

public interface ILanguageRepository
{
    Task<Language> GetByIdAsync(long id);
    Task<Language> GetByJudge0IdAsync(int judge0Id);
    Task<List<Language>> GetAllAsync();
}
