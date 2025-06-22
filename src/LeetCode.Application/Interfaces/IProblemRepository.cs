using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Interfaces;

public interface IProblemRepository
{
    Task<Problem> GetByIdAsync(long id);
    Task<List<Problem>> GetAllAsync();
    Task<List<Problem>> GetByDifficultyAsync(Difficulty difficulty);
    Task<List<Problem>> SearchAsync(string keyword);
    Task<long> AddAsync(Problem problem);
    Task UpdateAsync(Problem problem);
    Task DeleteAsync(long id);
}
