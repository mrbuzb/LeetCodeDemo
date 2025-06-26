using LeetCode.Domain.Entities;

namespace LeetCode.Application.Dtos;

public class ProblemUpdateDto
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Difficulty Difficulty { get; set; }
    public string Tags { get; set; }
    public ICollection<ProblemTestCaseDto> TestCases { get; set; }
}
