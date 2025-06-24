using LeetCode.Application.Dtos;
using LeetCode.Application.Services;

namespace LeetCode.Api.Endpoints;

public static class SubmissionEndpoints
{
    public static void MapSubmissionEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/submission")
            .RequireAuthorization()
            .WithTags("Submission Management");

        userGroup.MapGet("/get-by-id",
            async (long id, ISubmissionService _service) =>
            {
                Results.Ok(await _service.GetByIdAsync(id));
            })
            .WithName("GetSubmissionById");

        userGroup.MapGet("/get-by-user-id",
            async (HttpContext context,ISubmissionService _service) =>
            {
                var userId = context.User.FindFirst("UserId")?.Value;
                if (userId == null)
                {
                    throw new UnauthorizedAccessException();
                }
                Results.Ok(await _service.GetByUserIdAsync(long.Parse(userId)));
            })
            .WithName("GetSubmissionByUserId");

        userGroup.MapGet("/get-by-problem-id",
            async (long id,ISubmissionService _service) =>
            {
                Results.Ok(await _service.GetByProblemIdAsync(id));
            })
            .WithName("GetSubmissionByProblemId");

        userGroup.MapPost("/create",
            async (HttpContext context,SubmissionDto submission,ISubmissionService _service) =>
            {
                var userId = context.User.FindFirst("UserId")?.Value;
                if (userId == null)
                {
                    throw new UnauthorizedAccessException();
                }
                return await _service.AddAsync(submission,long.Parse(userId));
            })
            .WithName("CreateSubmission");
    }
}