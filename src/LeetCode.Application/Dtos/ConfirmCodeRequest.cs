namespace LeetCode.Application.Dtos;

public class ConfirmCodeRequest
{
    public string Code { get; set; } = default!;
    public string Email { get; set; } = default!;
}