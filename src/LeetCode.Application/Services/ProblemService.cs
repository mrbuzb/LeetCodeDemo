using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Services;

public class ProblemService(IProblemRepository _repo) : IProblemService
{
    public async Task<long> AddAsync(ProblemDto problem, long creatorId)
    {
        var problemEntity = Converter(problem);
        problemEntity.CreatorId = creatorId;
        return await _repo.AddAsync(problemEntity);
    }

    public async Task DeleteAsync(long problemId,long id)
    {
        await _repo.DeleteAsync(problemId,id);
    }

    public async Task<List<ProblemUpdateDto>> GetAllAsync()
    {
        var problems = await _repo.GetAllAsync();
        return problems.Select(Converter).ToList();
    }

    public async Task<List<ProblemUpdateDto>> GetByDifficultyAsync(Difficulty difficulty)
    {
        var problems = await _repo.GetByDifficultyAsync(difficulty);
        return problems.Select(Converter).ToList();
    }

    public async Task<ProblemUpdateDto> GetByIdAsync(long id)
    {
        var problem = await _repo.GetByIdAsync(id);
        return Converter(problem);
    }

    public async Task<List<ProblemUpdateDto>> SearchAsync(string keyword)
    {
        var problems = await _repo.SearchAsync(keyword);
        return problems.Select(Converter).ToList();
    }

    public async Task UpdateAsync(ProblemUpdateDto problemDto,long creatorId)
    {
        var problem = await _repo.GetByIdAsync(problemDto.Id);
        if (problem.CreatorId != creatorId)
        {
            throw new NotAllowedException("You are not the creator of this problem");
        }
        problem.Title = problemDto.Title;
        problem.Description = problemDto.Description;
        problem.Difficulty = problemDto.Difficulty;
        await _repo.UpdateAsync(problem);
    }

    private Problem Converter(ProblemDto problem)
    {
        return new Problem
        {
            CreatedAt = DateTime.Now,
            Description = problem.Description,
            Difficulty = problem.Difficulty,
            Tags = problem.Tags,
            Title = problem.Title,
        };
    }

    private ProblemUpdateDto Converter(Problem problem)
    {
        return new ProblemUpdateDto
        {
            Description = problem.Description,
            Difficulty = problem.Difficulty,
            Tags = problem.Tags,
            Title = problem.Title,
            Id = problem.Id,
        };
    }

}
