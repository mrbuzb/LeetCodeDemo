import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../types';


import { CommonModule } from '@angular/common';
type DifficultyLabel = 'Easy' | 'Medium' | 'Hard';

export interface ProblemWithLabel extends Problem {
  difficultyLabel: DifficultyLabel;
  description: string;
  tags: string[];
  submissions: number;
  acceptanceRate: number;
}

@Component({
  selector: 'app-problems',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
        <p class="text-gray-600">
          Solve coding challenges to improve your programming skills
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select formControlName="difficulty" class="input">
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select formControlName="status" class="input">
              <option value="all">All Problems</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select formControlName="sortBy" class="input">
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
              <option value="acceptance">Acceptance Rate</option>
              <option value="submissions">Submissions</option>
            </select>
          </div>

          <div class="flex items-end">
            <button type="button" (click)="applyFilters()" class="btn btn-primary w-full">
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      <!-- Problems List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            {{ filteredProblems.length }} Problems
          </h2>
        </div>

        <div *ngIf="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading problems...</p>
        </div>

        <div *ngIf="!isLoading && filteredProblems.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
            </path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No problems found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later.</p>
        </div>

        <div *ngIf="!isLoading && filteredProblems.length > 0" class="divide-y divide-gray-200">
          <div *ngFor="let problem of filteredProblems" class="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-medium text-gray-900">
                    <a [routerLink]="['/problems', problem.id]" class="hover:text-primary-600 transition-colors">
                      {{ problem.title }}
                    </a>
                  </h3>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="{
                      'bg-green-100 text-green-800': problem.difficultyLabel === 'Easy',
                      'bg-yellow-100 text-yellow-800': problem.difficultyLabel === 'Medium',
                      'bg-red-100 text-red-800': problem.difficultyLabel === 'Hard'
                    }">
                    {{ problem.difficultyLabel }}
                  </span>
                </div>

                <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                  {{ problem.description }}
                </p>

                <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{{ problem.submissions }} submissions</span>
                  <span>{{ problem.acceptanceRate }}% acceptance</span>
                  <div class="flex space-x-1">
                    <span *ngFor="let tag of problem.tags.slice(0, 3)"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                      {{ tag }}
                    </span>
                    <span *ngIf="problem.tags.length > 3"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800">
                      +{{ problem.tags.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="ml-4">
                <a [routerLink]="['/problems', problem.id]" class="btn btn-primary">
                  Solve
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProblemsComponent implements OnInit {
  problems: ProblemWithLabel[] = [];
  filteredProblems: ProblemWithLabel[] = [];
  isLoading = true;
  filterForm: FormGroup;

  constructor(
    private problemService: ProblemService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      difficulty: [''],
      status: ['all'],
      sortBy: ['title']
    });
  }

  ngOnInit() {
    this.loadProblems();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadProblems() {
    this.problemService.getProblems().subscribe({
      next: (problems) => {
        this.problems = problems.map(p => ({
          ...p,
          difficultyLabel: this.mapDifficulty(p.difficulty),
          description: p.description || 'No description available.',
          tags: p.tags || [],
          submissions: p.submissions ?? 0,
          acceptanceRate: p.acceptanceRate ?? 0
        }));
        this.filteredProblems = [...this.problems];
        this.isLoading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading problems:', error);
        this.isLoading = false;
        this.problems = [];
        this.filteredProblems = [];
      }
    });
  }

  mapDifficulty(value: string | number): DifficultyLabel {
    const difficultyNum = typeof value === 'string' ? parseInt(value) : value;
    switch (difficultyNum) {
      case 0: return 'Easy';
      case 1: return 'Medium';
      case 2: return 'Hard';
      default: return 'Easy';
    }
  }

  applyFilters() {
    const filters = this.filterForm.value;
    let filtered = [...this.problems];

    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficultyLabel === filters.difficulty);
    }

    const order: Record<DifficultyLabel, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3
    };

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'difficulty':
          return order[a.difficultyLabel] - order[b.difficultyLabel];
        case 'acceptance':
          return b.acceptanceRate - a.acceptanceRate;
        case 'submissions':
          return b.submissions - a.submissions;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    this.filteredProblems = filtered;
  }
}
