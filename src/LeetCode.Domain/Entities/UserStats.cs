namespace LeetCode.Domain.Entities;

public class UserStats
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public User User { get; set; }
    public long SolvedCount { get; set; }
    public long TotalSubmits { get; set; }
    public float Accuracy { get; set; }
    public DateTime UpdatedAt { get; set; }
}
