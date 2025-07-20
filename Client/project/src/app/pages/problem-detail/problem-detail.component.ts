import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface TestCase {
  input: string;
  expected: string;
  isSample: boolean;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  difficultyLabel?: 'Easy' | 'Medium' | 'Hard';
  tags: string[] | string;
  submissions: number;
  acceptanceRate: number;
  starterCode?: string;
  testCases: TestCase[];
}

export interface Submission {
  passedTestcases: string;
  status: string;
  output?: string;
  memoryUsed?: number;
  timeUsed?: number;
  errorMessage?: string;
  isAccepted?: boolean;
}

export interface Language {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private baseUrl = 'http://localhost:5272/api';

  constructor(private http: HttpClient) {}

  private createAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getProblem(id: string): Observable<Problem> {
    return this.http.get<Problem>(
      `${this.baseUrl}/problem/get-by-id?id=${id}`,
      this.createAuthHeaders()
    );
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(
      `${this.baseUrl}/language/get-all`,
      this.createAuthHeaders()
    );
  }

  submitSolution(problemId: string, code: string, languageId: number): Observable<Submission> {
    return this.http.post<Submission>(
      `${this.baseUrl}/submission/create`,
      {
        problemId: Number(problemId),
        languageId,
        code
      },
      this.createAuthHeaders()
    );
  }
}

@Component({
  selector: 'app-problem-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div *ngIf="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading problem...</p>
      </div>

      <div *ngIf="!isLoading && problem" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <h1 class="text-3xl font-bold text-gray-900">{{ problem.title }}</h1>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    [ngClass]="{
                      'bg-green-100 text-green-800': problem.difficultyLabel === 'Easy',
                      'bg-yellow-100 text-yellow-800': problem.difficultyLabel === 'Medium',
                      'bg-red-100 text-red-800': problem.difficultyLabel === 'Hard'
                    }">
                {{ problem.difficultyLabel }}
              </span>
            </div>

            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>{{ problem.submissions }} submissions</span>
              <span>{{ problem.acceptanceRate }}% acceptance</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-6" *ngIf="problemTags.length > 0">
              <span *ngFor="let tag of problemTags"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div class="prose prose-sm max-w-none text-gray-700" [innerHTML]="safeDescription"></div>
          </div>

          <div class="bg-white rounded-lg shadow p-6" *ngIf="visibleTestCases.length > 0">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Examples</h2>
            <div class="space-y-4">
              <div *ngFor="let testCase of visibleTestCases; let i = index"
                   class="bg-gray-50 rounded-lg p-4">
                <h3 class="font-medium text-gray-900 mb-2">Example {{ i + 1 }}:</h3>
                <div class="space-y-2 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Input:</span>
                    <code class="ml-2 bg-gray-200 px-2 py-1 rounded">{{ format(testCase.input) }}</code>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Output:</span>
                    <code class="ml-2 bg-gray-200 px-2 py-1 rounded">{{ format(testCase.expected) }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Solution</h2>

            <form [formGroup]="codeForm" (ngSubmit)="submitSolution()">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select formControlName="language" class="input w-full" [disabled]="languages.length === 0">
                  <option *ngFor="let lang of languages" [value]="lang.id">{{ lang.name }}</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Code</label>
                <textarea
                  formControlName="code"
                  rows="10"
                  class="input font-mono text-sm w-full border border-gray-300 rounded"
                  placeholder="Write your solution here..."></textarea>
              </div>

              <button type="submit"
                      [disabled]="codeForm.invalid || isSubmitting"
                      class="btn btn-primary w-full bg-blue-600 text-white py-2 rounded">
                <span *ngIf="isSubmitting">Submitting...</span>
                <span *ngIf="!isSubmitting">Submit</span>
              </button>
            </form>
          </div>

          <div *ngIf="submissionResult" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Result</h3>

            <div class="p-4 rounded-lg"
                 [ngClass]="{
                   'bg-green-50 border border-green-200': submissionResult.isAccepted,
                   'bg-red-50 border border-red-200': !submissionResult.isAccepted
                 }">
              <span class="font-medium"
                    [ngClass]="{
                      'text-green-800': submissionResult.isAccepted,
                      'text-red-800': !submissionResult.isAccepted
                    }">
                {{ format(submissionResult.status) }}
              </span>
              <div class="text-sm text-gray-600 mt-2 space-y-1">
                <div *ngIf="submissionResult.passedTestcases">
                  Passed Testcases: {{ submissionResult.passedTestcases }}
                </div>
                <div *ngIf="submissionResult.timeUsed != null">
                  Runtime: {{ submissionResult.timeUsed }}ms
                </div>
                <div *ngIf="submissionResult.memoryUsed != null">
                  Memory: {{ submissionResult.memoryUsed }}MB
                </div>
                <div *ngIf="submissionResult.output">
                  Output: {{ submissionResult.output }}
                </div>
                <div *ngIf="submissionResult.errorMessage">
                  <span class="text-red-600">Error:</span> {{ submissionResult.errorMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && !problem" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Problem Not Found</h2>
        <p class="text-gray-600 mb-6">The problem you're looking for doesn't exist.</p>
        <a routerLink="/problems" class="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded">Back to Problems</a>
      </div>
    </div>
  `,
  styles: []
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem | null = null;
  isLoading = true;
  isSubmitting = false;
  codeForm: FormGroup;
  submissionResult: Submission | null = null;
  languages: Language[] = [];
  problemTags: string[] = [];
  safeDescription: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private problemService: ProblemService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.codeForm = this.fb.group({
      code: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  ngOnInit() {
    const problemId = this.route.snapshot.paramMap.get('id');
    if (problemId) {
      this.loadProblem(problemId);
      this.loadLanguages();
    }
  }

  loadProblem(id: string) {
    this.problemService.getProblem(id).subscribe({
      next: (problem) => {
        problem.difficultyLabel = this.mapDifficulty(problem.difficulty);

        this.problem = problem;

        if (typeof problem.tags === 'string') {
          this.problemTags = problem.tags.split(',').map(t => t.trim());
        } else {
          this.problemTags = problem.tags ?? [];
        }

        this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(problem.description || '');

        if (problem.starterCode != null) {
          this.codeForm.patchValue({ code: problem.starterCode });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading problem:', error);
        this.problem = null;
        this.isLoading = false;
      }
    });
  }

  loadLanguages() {
    this.problemService.getLanguages().subscribe({
      next: (langs) => {
        this.languages = langs;
        if (langs.length > 0) {
          this.codeForm.patchValue({ language: langs[0].id });
        }
      },
      error: (error) => {
        console.error('Error loading languages:', error);
        this.languages = [];
      }
    });
  }

  mapDifficulty(value: number | string): 'Easy' | 'Medium' | 'Hard' {
    if (value === 0 || value === '0') return 'Easy';
    if (value === 1 || value === '1') return 'Medium';
    if (value === 2 || value === '2') return 'Hard';
    return 'Easy';
  }

  get visibleTestCases() {
    return this.problem?.testCases?.filter(tc => tc.isSample) || [];
  }

  format(value: string | undefined | null) {
    return value != null ? value : '-';
  }

  submitSolution() {
    if (!this.problem || this.codeForm.invalid) return;

    this.isSubmitting = true;
    this.submissionResult = null;

    const code = this.codeForm.get('code')?.value;
    const languageId = Number(this.codeForm.get('language')?.value);

    this.problemService.submitSolution(this.problem.id, code, languageId).subscribe({
      next: (submission) => {
        console.log("Submission response:", submission);
        this.submissionResult = submission;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting solution:', error);
        this.isSubmitting = false;
      }
    });
  }
}
