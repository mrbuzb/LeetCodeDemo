using LeetCode.Domain.Entities;

namespace LeetCode.Application.Dtos;

public class SubmissionUpdateDto
{
    public long Id { get; set; }
    public long ProblemId { get; set; }
    public long LanguageId { get; set; }
    public string Code { get; set; }
    public string Status { get; set; }
    public string Output { get; set; }
    public float TimeUsed { get; set; }
    public float MemoryUsed { get; set; }
    public DateTime SubmittedAt { get; set; }
}
