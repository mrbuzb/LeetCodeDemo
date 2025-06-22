namespace LeetCode.Domain.Entities;

public class Problem
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Difficulty { get; set; }
    public string Tags { get; set; }
    public long CreatorId { get; set; }
    public User User { get; set; }
    public DateTime CreatedAt { get; set; }
}
