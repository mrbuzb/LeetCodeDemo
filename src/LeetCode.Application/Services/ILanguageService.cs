using LeetCode.Application.Dtos;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public interface ILanguageService
{
    Task<LanguageDto> GetByIdAsync(long id);
    Task<LanguageDto> GetByJudge0IdAsync(int judge0Id);
    Task<List<LanguageDto>> GetAllAsync();
}