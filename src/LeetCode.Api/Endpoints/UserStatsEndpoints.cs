using LeetCode.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LeetCode.Api.Endpoints;

public static class UserStatsEndpoints
{
    public static void MapUserStatsEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/user-stats")
            .RequireAuthorization()
            .WithTags("UserStats Management");

        userGroup.MapGet("/get-weekly-raiting",
            async ([FromServices] IUserStatsServise _service) =>
            {
                return Results.Ok(await _service.GetTopWeeklyAsync());
            })
            .WithName("GetWeeklyRaiting");

        userGroup.MapGet("/get-monthly-raiting",
            async ([FromServices] IUserStatsServise _service) =>
            {
                return Results.Ok(await _service.GetTopMonthlyAsync());
            })
            .WithName("GetMonthlyRaiting");

        userGroup.MapGet("/get-all-time-raiting",
            async ([FromServices] IUserStatsServise _service) =>
            {
                return Results.Ok(await _service.GetTopAllTimeAsync());
            })
            .WithName("GetAllTimeRaiting");
    }
}