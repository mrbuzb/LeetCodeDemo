namespace LeetCode.Application.Dtos;

public class SubmissionResultDto
{
    public string PassedTestcases { get; set; }
    public string Status { get; set; }
    public string Output { get; set; }
    public float TimeUsed { get; set; }
    public float MemoryUsed { get; set; }
}
