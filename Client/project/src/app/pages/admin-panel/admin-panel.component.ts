import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p class="text-gray-600">Manage problems, users, and platform settings</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm font-medium text-gray-500">Total Users</p>
          <p class="text-2xl font-semibold text-gray-900">{{ users.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm font-medium text-gray-500">Total Problems</p>
          <p class="text-2xl font-semibold text-gray-900">{{ problems.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm font-medium text-gray-500">Total Submissions</p>
          <p class="text-2xl font-semibold text-gray-900">{{ totalSubmissions }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-sm font-medium text-gray-500">Avg. Acceptance Rate</p>
          <p class="text-2xl font-semibold text-gray-900">{{ avgAcceptanceRate }}%</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab.id"
              [ngClass]="{
                'border-primary-500 text-primary-600': activeTab === tab.id,
                'border-transparent text-gray-500': activeTab !== tab.id
              }"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-gray-700 hover:border-gray-300 transition-colors"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Problems Tab -->
          <div *ngIf="activeTab === 'problems'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-lg font-medium text-gray-900">Manage Problems</h2>
              <button class="btn btn-primary" (click)="openAddModal()">Add New Problem</button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let problem of problems">
                    <td class="px-6 py-4">{{ problem.title }}</td>
                    <td class="px-6 py-4">{{ mapDifficulty(problem.difficulty) }}</td>
                    <td class="px-6 py-4">
                      <button class="text-primary-600 hover:text-primary-900 mr-2" (click)="openEditModal(problem)">Edit</button>
                      <button class="text-red-600 hover:text-red-900" (click)="deleteProblem(problem.id)">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Users Tab -->
          <div *ngIf="activeTab === 'users'">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">Users Management</h2>
              <select [(ngModel)]="selectedRole" (change)="loadUsers()" class="border border-gray-300 p-2 rounded">
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>

            <table class="min-w-full divide-y divide-gray-200 mt-4">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of users">
                  <td class="px-6 py-4">{{ user.email }}</td>
                  <td class="px-6 py-4">{{ user.firstName }}</td>
                  <td class="px-6 py-4">
                    <select [ngModel]="user.role" (ngModelChange)="updateUserRole(user.userId, $event)" class="border border-gray-300 p-1 rounded">
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td class="px-6 py-4">
                    <button
                      *ngIf="user.role !== 'SuperAdmin'"
                      class="text-red-600 hover:text-red-900"
                      (click)="deleteUser(user.userId)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Settings Tab -->
          <div *ngIf="activeTab === 'settings'">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Platform Settings</h2>
            <p>Settings form here.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      *ngIf="isModalOpen"
    >
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h2 class="text-xl font-bold mb-4">{{ modalMode === 'add' ? 'Add Problem' : 'Edit Problem' }}</h2>

        <form [formGroup]="problemForm" (ngSubmit)="submitProblem()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input formControlName="title" class="border border-gray-300 p-2 rounded w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea formControlName="description" class="border border-gray-300 p-2 rounded w-full"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select formControlName="difficulty" class="border border-gray-300 p-2 rounded w-full">
                <option [value]="0">Easy</option>
                <option [value]="1">Medium</option>
                <option [value]="2">Hard</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input formControlName="tags" class="border border-gray-300 p-2 rounded w-full" />
            </div>

            <div *ngIf="modalMode === 'add'">
              <h3 class="font-semibold mt-4 mb-2">Test Cases</h3>
              <div formArrayName="testCases" class="space-y-4">
                <div *ngFor="let tc of testCases.controls; let i = index" [formGroupName]="i" class="border p-3 rounded">
                  <label class="block text-xs font-medium text-gray-700">Input</label>
                  <input formControlName="input" class="border border-gray-300 p-2 rounded w-full mb-2" />
                  <label class="block text-xs font-medium text-gray-700">Expected</label>
                  <input formControlName="expected" class="border border-gray-300 p-2 rounded w-full mb-2" />
                  <label class="inline-flex items-center">
                    <input type="checkbox" formControlName="isSample" class="mr-2" />
                    <span class="text-sm">Is Sample</span>
                  </label>
                  <button type="button" class="text-red-600 text-sm mt-2" (click)="removeTestCase(i)">Remove</button>
                </div>
              </div>
              <button type="button" class="mt-3 px-3 py-1 bg-primary-600 text-white rounded" (click)="addTestCase()">Add Test Case</button>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" class="px-4 py-2 bg-gray-300 rounded" (click)="closeModal()">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-primary-600 text-white rounded">{{ modalMode === 'add' ? 'Create' : 'Update' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AdminPanelComponent implements OnInit {
  activeTab = 'problems';

  problems: any[] = [];
  users: any[] = [];
  totalSubmissions = 0;
  avgAcceptanceRate = 0;

  selectedRole = 'User';

  problemForm!: FormGroup;
  isModalOpen = false;
  modalMode: 'add' | 'edit' = 'add';

  tabs = [
    { id: 'problems', label: 'Problems' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' }
  ];

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadProblems();
    this.loadUsers();

    this.problemForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      description: ['', Validators.required],
      difficulty: [0, Validators.required],
      tags: [''],
      testCases: this.fb.array([])
    });
  }

  get testCases(): FormArray {
    return this.problemForm.get('testCases') as FormArray;
  }

  openAddModal() {
    this.modalMode = 'add';
    this.problemForm.reset({
      id: 0,
      title: '',
      description: '',
      difficulty: 0,
      tags: '',
      testCases: []
    });
    this.testCases.clear();
    this.addTestCase();
    this.isModalOpen = true;
  }

  openEditModal(problem: any) {
    this.modalMode = 'edit';
    this.problemForm.patchValue({
      id: problem.id,
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      tags: problem.tags
    });
    this.testCases.clear();
    this.isModalOpen = true;
  }

  addTestCase() {
    this.testCases.push(
      this.fb.group({
        input: ['', Validators.required],
        expected: ['', Validators.required],
        isSample: [true]
      })
    );
  }

  removeTestCase(index: number) {
    this.testCases.removeAt(index);
  }

  submitProblem() {
    const data = this.problemForm.value;
    if (this.modalMode === 'add') {
      this.apiService.post('/admin/create-problem', data).subscribe(() => {
        this.loadProblems();
        this.closeModal();
      });
    } else {
      this.apiService.put('/admin/update-problem', data).subscribe(() => {
        this.loadProblems();
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deleteProblem(id: number) {
    this.apiService.delete(`/admin/delete-problem?problemId=${id}`).subscribe(() => this.loadProblems());
  }

  loadProblems() {
    this.apiService.get<any[]>('/problem/get-all').subscribe((data) => {
      this.problems = data;
      this.totalSubmissions = data.reduce((acc, p) => acc + (p.submissions || 0), 0);
      this.avgAcceptanceRate = data.length
        ? Math.round(data.reduce((acc, p) => acc + (p.acceptanceRate || 0), 0) / data.length)
        : 0;
    });
  }

  loadUsers() {
    this.apiService
      .get<any[]>(`/admin/get-all-users-by-role?role=${this.selectedRole}`)
      .subscribe((users) => {
        this.users = users;
      });
  }

  updateUserRole(userId: number, newRole: string) {
    this.apiService
      .patch(`/admin/update-role?userId=${userId}&userRole=${newRole}`, {})
      .subscribe(() => {
        this.loadUsers();
      });
  }

  deleteUser(userId: number) {
    this.apiService
      .delete(`/admin/delete-user-by-id?userId=${userId}`)
      .subscribe(() => {
        this.loadUsers();
      });
  }

  mapDifficulty(difficulty: number): string {
    switch (difficulty) {
      case 0:
        return 'Easy';
      case 1:
        return 'Medium';
      case 2:
        return 'Hard';
      default:
        return 'Unknown';
    }
  }
}
