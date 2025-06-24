using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LeetCode.Domain.Entities;

namespace LeetCode.Application.Interfaces;

public interface ISubmissionRepository
{
    Task<Submission> GetByIdAsync(long id);
    Task<List<Submission>> GetByUserIdAsync(long userId);
    Task<List<Submission>> GetByProblemIdAsync(long problemId);
    Task<long> AddAsync(Submission submission);
    Task UpdateAsync(Submission submission);
    Task DeleteAsync(long id);
}
