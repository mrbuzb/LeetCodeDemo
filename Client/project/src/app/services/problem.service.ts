import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Problem, Submission } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  constructor(private apiService: ApiService) {}

  // GET /api/problem => problem ro'yxatini olish
  getProblems(): Observable<Problem[]> {
    return this.apiService.get<Problem[]>('/problem/get-all');
  }

  // GET /api/problem/get-by-id?id=...
  getProblem(id: string): Observable<Problem> {
    return this.apiService.get<Problem>(
      '/problem/get-by-id',
      { id }
    );
  }

  // POST /api/submission => yechimni topshirish
  submitSolution(problemId: string, code: string): Observable<Submission> {
    return this.apiService.post<Submission>('/submission', {
      problemId,
      code
    });
  }

  // GET /api/submission yoki /api/submission?problemId=...
  getSubmissions(problemId?: string): Observable<Submission[]> {
    const endpoint = problemId ? `/submission?problemId=${problemId}` : '/submission';
    return this.apiService.get<Submission[]>(endpoint);
  }

  // GET /api/submission/{id}
  getSubmission(id: string): Observable<Submission> {
    return this.apiService.get<Submission>(`/submission/${id}`);
  }

  // POST /api/problem/run => kodni ishga tushirish
  runCode(problemId: string, code: string): Observable<any> {
    return this.apiService.post('/problem/run', {
      problemId,
      code
    });
  }
}
