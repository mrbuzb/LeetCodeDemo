using System.Text;
using System.Text.Json;
using LeetCode.Application.Dtos;
using LeetCode.Application.Interfaces;
using LeetCode.Core.Errors;
using LeetCode.Domain.Entities;
using static System.Net.Mime.MediaTypeNames;
namespace LeetCode.Application.Services;


public class SubmissionService : ISubmissionService
{
    private readonly HttpClient _httpClient = new HttpClient();
    private readonly ISubmissionRepository _submissionRepo;
    private readonly IProblemRepository _problemRepo;
    private readonly ILanguageRepository _languageRepo;
    private readonly IUserStatsRepository _userStatsRepo;

    public SubmissionService(ISubmissionRepository repo, IProblemRepository problemRepo, ILanguageRepository languageRepo, IUserStatsRepository userStatsRepo)
    {
        _submissionRepo = repo;
        _problemRepo = problemRepo;
        _languageRepo = languageRepo;
        _userStatsRepo = userStatsRepo;
    }

    private static string EscapeDoubleQuotes(string input)
    {
        bool insideQuotes = false;
        var result = new System.Text.StringBuilder();

        foreach (char c in input)
        {
            if (c == '"')
            {
                if (!insideQuotes)
                {
                    result.Append("\"");
                    insideQuotes = true;
                }
                else
                {
                    result.Append("\"");
                    insideQuotes = false;
                }
            }
            else
            {
                result.Append(c);
            }
        }

        return result.ToString();
    }


    private string TestRunnerCSharp(string code,TestCase testCase)
    {

        string testRunnerCode = $@"
using System;
using System.Collections;
using System.Collections.Generic;

public class Program
{{
    public static void Main()
    {{
        object result = Result({testCase.Input}); // object qilib olamiz

        // Agar result IEnumerable bo‘lsa (lekin string emas)
        if (result is IEnumerable enumerable && !(result is string))
        {{
            var list = new List<object>();
            foreach (var item in enumerable)
            {{
                list.Add(item);
            }}
            Console.WriteLine(""["" + string.Join("","", list) + ""]"");
        }}
        else
        {{
            Console.WriteLine(result.ToString().ToLower());
        }}
    }}

    {code}
}}";


        return testRunnerCode;
    }

    string Normalize(string str)
    {
        return string.Join('\n',
    (str ?? "")
    .Trim()
    .Split('\n')
    .Select(line => line.Trim('"').TrimEnd())
);

    }
    bool IsEqual(string actual, string expected)
    {
        return Normalize(actual).Contains(Normalize(expected)) || actual == expected;
    }



    public async Task<SubmissionResultDto> AddAsync(SubmissionDto submission, long userId)
    {
        var stats = await _userStatsRepo.GetByUserIdAsync(userId);

        submission.Code = EscapeDoubleQuotes(submission.Code);
        var problem = await _problemRepo.GetByIdAsync(submission.ProblemId);
        var result = new SubmissionResultDto();
        result.IsAccepted = false;
        int passedCount = 0;
        float totalTime = 0;
        float totalMemory = 0;
        var language = await _languageRepo.GetByIdAsync((int)submission.LanguageId);
        foreach (var testCase in problem.TestCases)
        {
            var request = new
            {
                language_id = language.Judge0Id,
                source_code = language.Name.ToLower().Contains("c#--Error") ? TestRunnerCSharp(submission.Code,testCase) : submission.Code,
                stdin = language.Name.ToLower().Contains("c#") ? "" : testCase.Input
            };

            var jsonRequest = JsonSerializer.Serialize(request);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(
                "http://localhost:2358/submissions?base64_encoded=false&wait=true", content);

            if (!response.IsSuccessStatusCode)
            {
                throw new NotAllowedException();
            }

            var resContent = await response.Content.ReadAsStringAsync();
            var judgeResult = JsonSerializer.Deserialize<Judge0Response>(resContent);

            if (judgeResult is null)
                continue;

            if (judgeResult.status?.description != "Accepted")
            {
                await _submissionRepo.AddAsync(new Submission
                {
                    UserId = userId,
                    ProblemId = submission.ProblemId,
                    LanguageId = language.Id,
                    Code = submission.Code,
                    Output = result.PassedTestcases,
                    Status = result.Status,
                    TimeUsed = result.TimeUsed,
                    MemoryUsed = result.MemoryUsed,
                    SubmittedAt = DateTime.Now
                });
                stats.TotalSubmits++;
                await _userStatsRepo.UpdateAsync(stats);
                result.ErrorMessage = judgeResult.stderr ?? judgeResult.compile_output ?? "Error";
                return result;
            }

            string actual = judgeResult.stdout?.Trim() ?? "";
            string expected = testCase.Expected.Trim();



            if (float.TryParse(judgeResult.time, out float time))
                totalTime += time;

            totalMemory += judgeResult.memory.GetValueOrDefault(0);

            expected = expected.Replace("\\n", "\n");
            if (IsEqual(actual, expected))
                passedCount++;
            if (!IsEqual(actual, expected))
            {
                result.PassedTestcases = $"{passedCount}/{problem.TestCases.Count()}";
                result.Output = actual;
                result.Status = "WrongAnswer";


                stats.TotalSubmits++;
                await _userStatsRepo.UpdateAsync(stats);

                return result;
            }
        }

        int totalTestCases = problem.TestCases.Count();
        result.PassedTestcases = $"{passedCount}/{totalTestCases}";
        result.Output ??= "All test cases passed";
        result.Status ??= "Accepted";
        result.TimeUsed = totalTime;
        result.MemoryUsed = totalMemory;
        result.IsAccepted = true;

        var userSubmissions = await _submissionRepo.GetByUserIdAsync(userId);
        var oldSubmission = userSubmissions.FirstOrDefault(x => x.ProblemId == submission.ProblemId && submission.LanguageId == submission.LanguageId);
        if (oldSubmission is null)
        {
            var addedSubmission = new Submission
            {
                UserId = userId,
                ProblemId = submission.ProblemId,
                LanguageId = language.Id,
                Code = submission.Code,
                Output = result.PassedTestcases,
                Status = result.Status,
                TimeUsed = result.TimeUsed,
                MemoryUsed = result.MemoryUsed,
                SubmittedAt = DateTime.Now
            };
            stats.TotalSubmits++;
            stats.SolvedCount++;
            stats.UpdatedAt = DateTime.Now;
            stats.Accuracy = (float)stats.SolvedCount / stats.TotalSubmits * 100;
            await _userStatsRepo.UpdateAsync(stats);
            await _submissionRepo.AddAsync(addedSubmission);



            await _submissionRepo.AddAsync(new Submission
            {
                UserId = userId,
                ProblemId = submission.ProblemId,
                LanguageId = language.Id,
                Code = submission.Code,
                Output = result.PassedTestcases,
                Status = result.Status,
                TimeUsed = result.TimeUsed,
                MemoryUsed = result.MemoryUsed,
                SubmittedAt = DateTime.Now
            });
        }
        else
        {
            oldSubmission.Code = submission.Code;
            oldSubmission.Output = result.PassedTestcases;
            oldSubmission.Status = result.Status;
            oldSubmission.TimeUsed = result.TimeUsed;
            oldSubmission.MemoryUsed = result.MemoryUsed;
            oldSubmission.SubmittedAt = DateTime.Now;
            await _submissionRepo.UpdateAsync(oldSubmission);
        }
        
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
            MemoryUsed = submission.MemoryUsed.Value,
            Id = submission.Id,
            Output = submission.Output,
            Status = submission.Status,
            TimeUsed = submission.TimeUsed.Value,
            Code = submission.Code,
            LanguageId = submission.LanguageId,
            ProblemId = submission.ProblemId,
        };
    }

}
