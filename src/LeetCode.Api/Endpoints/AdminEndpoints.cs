using System.Security.Claims;
using LeetCode.Application.Dtos;
using LeetCode.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventSystem.Server.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/admin")
                   .WithTags("Admin Endpoints");



        userGroup.MapPost("/create-problem", [Authorize(Roles = "Admin, SuperAdmin")]
        async (HttpContext context, ProblemDto problem, IProblemService _service) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            return await _service.AddAsync(problem, long.Parse(userId));
        })
            .WithName("CreateProblem");

        userGroup.MapPut("/update-problem", [Authorize(Roles = "Admin, SuperAdmin")]
        async (HttpContext context, ProblemUpdateDto problem, IProblemService _service) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.UpdateAsync(problem, long.Parse(userId));
        })
            .WithName("UpdateProblem");

        userGroup.MapDelete("/delete-problem", [Authorize(Roles = "Admin, SuperAdmin")]
        async (HttpContext context,long problemId,IProblemService _service) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.DeleteAsync(problemId, long.Parse(userId));
        })
            .WithName("DeleteProblem");
        
        userGroup.MapDelete("/delete-submission", [Authorize(Roles = "Admin, SuperAdmin")]
        async (long submissionId,ISubmissionService _service) =>
        {
            await _service.DeleteAsync(submissionId);
        })
            .WithName("DeleteSubmission");

        userGroup.MapPost("/create-test-case", [Authorize(Roles = "Admin, SuperAdmin")]
        async (TestCaseDto testCase, ITestCaseService _service) =>
        {
            return Results.Ok(await _service.AddAsync(testCase));
        })
            .WithName("CreateTestCase");

        userGroup.MapPut("/update-test-case", [Authorize(Roles = "Admin, SuperAdmin")]
        async (TestCaseUpdateDto problem, ITestCaseService _service) =>
        {
            await _service.UpdateAsync(problem);
        })
            .WithName("UpdateTestCase");

        userGroup.MapDelete("/delete-test-case", [Authorize(Roles = "Admin, SuperAdmin")]
        async (long problemId,ITestCaseService _service) =>
        {
            await _service.DeleteAsync(problemId);
        })
            .WithName("DeleteTestCase");


        userGroup.MapGet("/get-all-users-by-role", [Authorize(Roles = "Admin, SuperAdmin")]
        [ResponseCache(Duration = 5, Location = ResponseCacheLocation.Any, NoStore = false)]
        async (string role, IRoleService _roleService) =>
        {
            var users = await _roleService.GetAllUsersByRoleAsync(role);
            return Results.Ok(new {success = true,data = users });
        })
            .WithName("GetAllUsersByRole");


        userGroup.MapDelete("/delete-user-by-id", [Authorize(Roles = "Admin, SuperAdmin")]
        async (long userId, HttpContext httpContext, IUserService userService) =>
        {
            var role = httpContext.User.FindFirst(ClaimTypes.Role)?.Value;
            await userService.DeleteUserByIdAsync(userId, role);
            return Results.Ok();
        })
        .WithName("DeleteUser");

        userGroup.MapPatch("/update-role", [Authorize(Roles = "SuperAdmin")]
        async (long userId, string userRole, IUserService userService) =>
        {
            await userService.UpdateUserRoleAsync(userId, userRole);
            return Results.Ok();
        })
        .WithName("UpdateUserRole");
    }
}
