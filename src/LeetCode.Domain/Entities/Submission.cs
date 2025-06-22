namespace LeetCode.Domain.Entities;

public class Submission
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public User User { get; set; }

    public long ProblemId { get; set; }
    public Problem Problem { get; set; }

    public long LanguageId { get; set; }
    public Language Language { get; set; }

    public string Code { get; set; }
    public string Status { get; set; }
    public string Output { get; set; }
    public float TimeUsed { get; set; }
    public float MemoryUsed { get; set; }
    public DateTime SubmittedAt { get; set; }
}
