using LeetCode.Application.Services;

namespace LeetCode.Api.Endpoints;

public static class TestCaseEndpoints
{
    public static void MapTestCaseEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/test-case")
            .RequireAuthorization()
            .WithTags("TestCase Management");

        userGroup.MapGet("/get-by-id",
            async (long id,ITestCaseService _service) =>
            {
                return Results.Ok(await _service.GetByIdAsync(id));
            })
            .WithName("GetTestCaseById");

        userGroup.MapGet("/get-by-problem-id",
            async (long id,ITestCaseService _service) =>
            {
                return Results.Ok(await _service.GetByProblemIdAsync(id));
            })
            .WithName("GetTestCaseByProblemId");
    }
}
