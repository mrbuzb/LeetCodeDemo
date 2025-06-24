using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Domain.Entities;
namespace LeetCode.Application.Services;


public class SubmissionService : ISubmissionService
{
    private readonly HttpClient _httpClient = new HttpClient();
    private readonly ISubmissionRepository _submissionRepo;
    private readonly IProblemRepository _problemRepo;
    private readonly ILanguageRepository _languageRepo;

    public SubmissionService(ISubmissionRepository repo, IProblemRepository problemRepo, ILanguageRepository languageRepo)
    {
        _submissionRepo = repo;
        _problemRepo = problemRepo;
        _languageRepo = languageRepo;
    }
    public async Task<SubmissionResultDto> AddAsync(SubmissionDto submission, long userId)
    {
        var problem = await _problemRepo.GetByIdAsync(submission.ProblemId);

        var result = new SubmissionResultDto();

        var testCasesCount = 0;
        var passedCount = 0;
        float totalTime = 0;
        float totalMemory = 0;

        foreach (var testCase in problem.TestCases)
        {
            var request = new
            {
                language_id = submission.LanguageId,
                source_code = submission.Code,
                stdin = testCase.Input ?? ""
            };

            var jsonRequest = JsonSerializer.Serialize(request);

            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(
                "http://localhost:2358/submissions?base64_encoded=false&wait=true", content);

            var resContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                continue;
            }

            var resultOfJudge0 = JsonSerializer.Deserialize<Judge0Response>(resContent);

            string actual = resultOfJudge0.stdout?.Trim() ?? "";
            string expected = testCase.Expected.Trim();

            if (actual == expected)
                passedCount++;

            totalTime +=float.Parse(resultOfJudge0.time);
            totalMemory +=resultOfJudge0.memory;

            string statusText = resultOfJudge0.status.description;

            if (statusText != "Accepted" || actual != expected)
            {
                result.PassedTestcases = $"{testCasesCount}/{problem.TestCases.Count()}";
                result.Output = resultOfJudge0.stdout;
                result.Status = resultOfJudge0.stderr;
                result.TimeUsed = totalTime;
                result.MemoryUsed = totalMemory;
                return result;
            }

            testCasesCount++;

            result.PassedTestcases = $"{testCasesCount}/{problem.TestCases.Count()}";
            result.Output = resultOfJudge0.stdout;
            result.Status = resultOfJudge0.stderr;
            result.TimeUsed = totalTime;
            result.MemoryUsed = totalMemory;
        }

        var language =await _languageRepo.GetByJudge0IdAsync((int)submission.LanguageId);

        var addedSubmission = new Submission
        {
            UserId = userId,
            ProblemId = submission.ProblemId,
            LanguageId = language.Id,
            Code = submission.Code,
            Output = result.PassedTestcases,
            Status = result.Status??"",
            TimeUsed = result.TimeUsed,
            MemoryUsed = result.MemoryUsed,
            SubmittedAt = DateTime.Now
        };

        await _submissionRepo.AddAsync(addedSubmission);
        return result;
    }


    public async Task DeleteAsync(long id)
    {
        await _submissionRepo.DeleteAsync(id);
    }

    public async Task<SubmissionUpdateDto> GetByIdAsync(long id)
    {
        var submission = await _submissionRepo.GetByIdAsync(id);
        return Converter(submission);
    }

    public async Task<List<SubmissionUpdateDto>> GetByProblemIdAsync(long problemId)
    {
        var submissions = await _submissionRepo.GetByProblemIdAsync(problemId);
        return submissions.Select(Converter).ToList();
    }

    public async Task<List<SubmissionUpdateDto>> GetByUserIdAsync(long userId)
    {
        var submissions = await _submissionRepo.GetByUserIdAsync(userId);
        return submissions.Select(Converter).ToList();
    }

    public Task UpdateAsync(SubmissionUpdateDto submission)
    {
        throw new NotImplementedException();
    }

    private SubmissionUpdateDto Converter(Submission submission)
    {
        return new SubmissionUpdateDto
        {
            SubmittedAt = DateTime.Now,
            MemoryUsed = submission.MemoryUsed,
            Id = submission.Id,
            Output = submission.Output,
            Status = submission.Status,
            TimeUsed = submission.TimeUsed,
            Code = submission.Code,
            LanguageId = submission.LanguageId,
            ProblemId = submission.ProblemId,
        };
    }

}
