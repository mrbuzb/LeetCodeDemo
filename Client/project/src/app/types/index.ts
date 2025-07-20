export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isAdmin: boolean;
  userName: string;
  role: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  testCases: TestCase[];
  starterCode: string;
  solution?: string;
  submissions: number;
  acceptanceRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtime?: number;
  memory?: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  solvedProblems: number;
  totalSubmissions: number;
  acceptanceRate: number;
  points: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface ProblemFilters {
  difficulty?: string;
  tags?: string[];
  status?: 'all' | 'solved' | 'unsolved';
  sortBy?: 'title' | 'difficulty' | 'acceptance' | 'submissions';
  sortOrder?: 'asc' | 'desc';
}