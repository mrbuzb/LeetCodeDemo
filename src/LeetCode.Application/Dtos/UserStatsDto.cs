namespace LeetCode.Application.Dtos;

public class UserStatsDto
{
    public long Id { get; set; }
    public string UserName { get; set; }
    public long SolvedCount { get; set; }
    public long TotalSubmits { get; set; }
    public float Accuracy { get; set; }
    public DateTime UpdatedAt { get; set; }

}

