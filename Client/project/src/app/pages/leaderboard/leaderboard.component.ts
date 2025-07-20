import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  role?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user?: User;
  solvedProblems: number;
  totalSubmissions: number;
  acceptanceRate: number;
  points: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p class="text-gray-600">See how you rank against other developers on the platform</p>
      </div>

      <div class="mb-6">
        <label for="timeRange" class="block text-sm font-medium text-gray-700 mb-2">Select Time Range</label>
        <select
          id="timeRange"
          [(ngModel)]="selectedRange"
          (change)="onRangeChange()"
          class="mt-1 block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="alltime">All Time</option>
        </select>
      </div>

      <div *ngIf="currentUser && userRank" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-blue-900 mb-1">Your Rank</h2>
            <p class="text-blue-700">
              You are ranked #{{ userRank?.rank || 'N/A' }} out of {{ userRank?.total || 0 }} users
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600">#{{ userRank?.rank || 'N/A' }}</div>
            <div class="text-sm text-blue-600">Your Position</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Top Performers</h2>
        </div>

        <div *ngIf="isLoading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading leaderboard...</p>
        </div>

        <div *ngIf="!isLoading && leaderboard.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems Solved</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance Rate</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let entry of leaderboard"
                  [class.bg-blue-50]="entry.user?.id === currentUser?.id"
                  class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
                         [ngClass]="{
                           'bg-yellow-100 text-yellow-800': entry.rank === 1,
                           'bg-gray-100 text-gray-800': entry.rank === 2,
                           'bg-orange-100 text-orange-800': entry.rank === 3,
                           'bg-gray-50 text-gray-600': entry.rank > 3
                         }">
                      <span class="text-sm font-medium">{{ entry.rank }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-blue-600">
                          {{ entry.user ? getUserInitials(entry.user) : 'U' }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ entry.user?.firstName && entry.user?.lastName
                          ? entry.user?.firstName + ' ' + entry.user?.lastName
                          : entry.user?.userName || 'Unknown' }}
                      </div>
                      <div class="text-sm text-gray-500">{{ entry.user?.userName || '' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ entry.solvedProblems }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ entry.totalSubmissions }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ entry.acceptanceRate }}%</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ entry.points }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="!isLoading && leaderboard.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p class="mt-1 text-sm text-gray-500">The leaderboard will populate as users solve problems.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-primary-50 { background-color: #eff6ff; }
    .text-primary-600 { color: #2563eb; }
    .border-primary-200 { border-color: #bfdbfe; }
    .text-primary-900 { color: #1e3a8a; }
    .bg-blue-50 { background-color: #ebf8ff; }
    .text-blue-600 { color: #3182ce; }
    .border-blue-200 { border-color: #bee3f8; }
  `]
})
export class LeaderboardComponent implements OnInit {
  private http = inject(HttpClient);

  leaderboard: LeaderboardEntry[] = [];
  userRank: { rank: number; total: number } | null = null;
  isLoading = true;
  selectedRange: string = 'weekly';

  currentUser: User | null = {
    id: '1',
    userName: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isAdmin: false,
    role: 'User'
  };

  ngOnInit() {
    this.loadLeaderboard();
    this.loadUserRank();
  }

  onRangeChange() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.isLoading = true;
    let url = '';

    if (this.selectedRange === 'weekly') {
      url = 'http://localhost:5272/api/user-stats/get-weekly-raiting';
    } else if (this.selectedRange === 'monthly') {
      url = 'http://localhost:5272/api/user-stats/get-monthly-raiting';
    } else {
      url = 'http://localhost:5272/api/user-stats/get-all-time-raiting';
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.leaderboard = data.map((item, index) => ({
          rank: index + 1,
          user: {
            id: item.id.toString(),
            userName: item.userName,
          },
          solvedProblems: item.solvedCount,
          totalSubmissions: item.totalSubmits,
          acceptanceRate: item.accuracy,
          points: item.solvedCount * 10,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.leaderboard = [];
        this.isLoading = false;
      }
    });
  }

  loadUserRank() {
    if (!this.currentUser) return;

    const url = `http://localhost:5272/api/user-stats/get-user-rank?userId=${this.currentUser.id}`;
    this.http.get<{ rank: number; total: number }>(url).subscribe({
      next: (data) => {
        this.userRank = data;
      },
      error: (err) => {
        console.error(err);
        this.userRank = null;
      }
    });
  }

  getUserInitials(user: User): string {
    if (user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return user.userName ? user.userName[0].toUpperCase() : 'U';
  }
}
