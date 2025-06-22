namespace LeetCode.Domain.Entities;

public class TestCases
{
    public long Id { get; set; }
    public long ProblemId { get; set; }
    public Problem Problem { get; set; }
    public string Input { get; set; }
    public string Expected { get; set; }
    public bool IsSample { get; set; }
}
