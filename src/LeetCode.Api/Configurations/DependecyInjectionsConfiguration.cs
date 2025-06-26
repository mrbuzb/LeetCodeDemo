using FluentValidation;
using LeetCode.Application.Dtos;
using LeetCode.Application.Helpers;
using LeetCode.Application.Interfaces;
using LeetCode.Application.Services;
using LeetCode.Application.Validators;
using LeetCode.Infrastructure.Persistence.Repositories;

namespace LeetCode.Api.Configurations;

public static class DependecyInjectionsConfiguration
{
    public static void ConfigureDependecies(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ILanguageService, LanguageService>();
        services.AddScoped<ITestCaseService, TestCaseService>();
        services.AddScoped<ISubmissionService, SubmissionService>();
        services.AddScoped<ISubmissionRepository, SubmissionRepository>();
        services.AddScoped<IProblemService, ProblemService>();
        services.AddScoped<IUserStatsRepository, UserStatsRepository>();
        services.AddScoped<IUserStatsServise, UserStatsServise>();
        services.AddScoped<ILanguageRepository, LanguageRepository>();
        services.AddScoped<ITestCaseRepository, TestCaseRepository>();
        services.AddScoped<IProblemRepository, ProblemRepository>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IRoleRepository, UserRoleRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IValidator<UserCreateDto>, UserCreateDtoValidator>();
        services.AddScoped<IValidator<UserLoginDto>, UserLoginDtoValidator>();
    }
}
