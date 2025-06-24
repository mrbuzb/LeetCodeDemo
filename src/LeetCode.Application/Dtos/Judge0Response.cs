using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeetCode.Application.Dtos;

public class Judge0Response
{
    public string stdout { get; set; }
    public string stderr { get; set; }
    public Status status { get; set; }
    public string time { get; set; }
    public int memory { get; set; }
}
