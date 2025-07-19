using LeetCode.Application.Dtos;
using LeetCode.Application.Services;

namespace LeetCode.Api.Endpoints;

public static class LanguageEndpoints
{
    public static void MapLanguageEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/language")
            .WithTags("Language Management");

        userGroup.MapGet("/get-all",
            async (ILanguageService _service) =>
            {
                return await _service.GetAllAsync();
            })
            .WithName("GetAllLanguages");

        userGroup.MapGet("/get-by-id",
            async (long id, ILanguageService _service) =>
            {
                var res = await _service.GetByIdAsync(id);
                return Results.Ok(res);
            })
            .WithName("GetLanguageById");

        userGroup.MapGet("/get-by-judge0-id",
        async (int id, ILanguageService _service) =>
        {
            var res = await _service.GetByJudge0IdAsync(id);
            return Results.Ok(res);
        })
        .WithName("GetByJudge0Id");
    }
}
