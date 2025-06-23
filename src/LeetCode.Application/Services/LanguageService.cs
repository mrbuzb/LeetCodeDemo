using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public class LanguageService(ILanguageRepository _repo) : ILanguageService
{
    public async Task<List<LanguageDto>> GetAllAsync()
    {
        var languages = await _repo.GetAllAsync();
        return languages.Select(Converter).ToList();
    }

    public async Task<LanguageDto> GetByIdAsync(long id)
    {
        var language = await _repo.GetByIdAsync(id);
        return Converter(language);
    }

    public async Task<LanguageDto> GetByJudge0IdAsync(int judge0Id)
    {
        var language = await _repo.GetByIdAsync(judge0Id);
        return Converter(language);
    }

    private LanguageDto Converter(Language entity)
    {
        return new LanguageDto
        {
            Judge0Id = entity.Judge0Id,
            Name = entity.Name,
            Id = entity.Id,
        };
    }
}
