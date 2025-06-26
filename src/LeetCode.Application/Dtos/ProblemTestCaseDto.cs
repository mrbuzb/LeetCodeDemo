using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeetCode.Application.Dtos;

public class ProblemTestCaseDto
{
    public string Input { get; set; }
    public string Expected { get; set; }
    public bool IsSample { get; set; }
}
