using LeetCode.Application.Dtos;
using LeetCode.Application.Services;
using LeetCode.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace LeetCode.Api.Endpoints;

public static class ProblemEndoints
{
    public static void MapProblemEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/problem")
            .RequireAuthorization()
            .WithTags("Problem Management");

        userGroup.MapGet("/get-all",
            async (IProblemService _service) =>
            {
                return Results.Ok(await _service.GetAllAsync());
            })
            .WithName("GetAllProblems");

        userGroup.MapGet("/get-by-id",
            async (long id,IProblemService _service) =>
            {
                return Results.Ok(await _service.GetByIdAsync(id));
            })
            .WithName("GetProblemById");
        
        userGroup.MapGet("/get-by-difficulty",
            async (Difficulty difficulty,IProblemService _service) =>
            {
                return Results.Ok(await _service.GetByDifficultyAsync(difficulty));
            })
            .WithName("GetProblemByDifficulty");
        
        userGroup.MapGet("/search-problem",
            async (string keyword,IProblemService _service) =>
            {
                return Results.Ok(await _service.SearchAsync(keyword));
            })
            .WithName("SearchProblem");
    }
}
