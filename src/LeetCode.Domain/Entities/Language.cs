namespace LeetCode.Domain.Entities;

public class Language
{
    public long Id { get; set; }
    public string Name { get; set; }
    public int Judge0Id { get; set; }
    public ICollection<Submission> Submissions { get; set; }
}
