using System.Security.Claims;
using LeetCode.Application.Dtos;

namespace LeetCode.Application.Helpers;

public interface ITokenService
{
    public string GenerateToken(UserGetDto user);
    public string GenerateRefreshToken();
    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}






