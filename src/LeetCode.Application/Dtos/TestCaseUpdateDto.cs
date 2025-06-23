namespace LeetCode.Application.Dtos;

public class TestCaseUpdateDto
{
    public long Id { get; set; }
    public long ProblemId { get; set; }
    public string Input { get; set; }
    public string Expected { get; set; }
    public bool IsSample { get; set; }
}
