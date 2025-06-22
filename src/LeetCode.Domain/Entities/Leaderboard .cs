using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeetCode.Domain.Entities;

public class Leaderboard
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public User User { get; set; }
    public long SolvedCount { get; set; }
    public long TotalSubmits { get; set; }
    public float Accuracy { get; set; }
    public DateTime UpdatedAt { get; set; }
}
