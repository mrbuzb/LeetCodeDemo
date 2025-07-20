import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LeaderboardEntry } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  constructor(private apiService: ApiService) {}

  getLeaderboard(limit?: number): Observable<LeaderboardEntry[]> {
    const params = limit ? { limit } : undefined;
    return this.apiService.get<LeaderboardEntry[]>('/leaderboard', params);
  }

  getUserRank(userId: string): Observable<{ rank: number; total: number }> {
    return this.apiService.get<{ rank: number; total: number }>(`/leaderboard/user/${userId}`);
  }
}