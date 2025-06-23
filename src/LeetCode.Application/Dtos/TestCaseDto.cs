using LeetCode.Domain.Entities;

namespace LeetCode.Application.Dtos;

public class TestCaseDto
{
    public long ProblemId { get; set; }
    public string Input { get; set; }
    public string Expected { get; set; }
    public bool IsSample { get; set; }
}
