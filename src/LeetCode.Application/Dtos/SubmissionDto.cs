using LeetCode.Domain.Entities;

namespace LeetCode.Application.Dtos;

public class SubmissionDto
{
    public long ProblemId { get; set; }
    public long LanguageId { get; set; }
    public string Code { get; set; }
}
