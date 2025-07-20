import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest, AuthState } from '../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.initializeAuth();
  }

  /**
   * Ilova yuklanganda avtomatik tokenni tekshiradi
   */
  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.decodeToken(token);
      if (user) {
        this.authStateSubject.next({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        this.authStateSubject.next({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      this.authStateSubject.next({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  /**
   * Login va token saqlash
   */
  login(credentials: LoginRequest): Observable<User | null> {
    this.setLoading(true);
    return this.apiService
      .post<{ accessToken: string; refreshToken: string | null; tokenType: string; expires: number }>(
        '/auth/login',
        credentials
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.accessToken);
        }),
        map((response) => {
          const user = this.decodeToken(response.accessToken);
          this.authStateSubject.next({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          return user;
        }),
        catchError((error) => {
          this.setLoading(false);
          throw error;
        })
      );
  }

  /**
   * Ro'yhatdan o'tish
   */
  register(userData: RegisterRequest): Observable<boolean> {
    this.setLoading(true);
    return this.apiService
      .post<any>('/auth/sign-up', userData, false)
      .pipe(
        switchMap(() => {
          const email = userData.email;
          localStorage.setItem('email', email);
          return this.sendCode(userData.email);
        }),
        map((sent) => {
          this.setLoading(false);
          return sent;
        }),
        catchError((error) => {
          this.setLoading(false);
          throw error;
        })
      );
  }

  /**
   * Kod yuborish
   */
  sendCode(email: string): Observable<boolean> {
    if (!email) {
      console.error('Email is undefined!');
      return of(false);
    }

    return this.apiService
      .post<{ success: boolean }>(
        '/auth/send-code',
        { email: email },
        false
      )
      .pipe(
        map((res) => {
          console.log('SendCode Response:', res);
          return res == undefined ? false : true;
        }),
        catchError((error) => {
          console.error('Send code failed:', error);
          return of(false);
        })
      );
  }

  /**
   * Kodni tasdiqlash
   */
  confirmCode(email: string, code: string): Observable<boolean> {
    return this.apiService
      .post<{ success: boolean }>('/auth/confirm-code', { email, code }, false)
      .pipe(
        map((res) => res.success),
        catchError(() => of(false))
      );
  }

  /**
   * Logout qilish
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.authStateSubject.next({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }

  /**
   * Foydalanuvchini token ichidan olish
   */
  private decodeToken(token: string): User | null {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;

      const payloadJson = atob(this.padBase64(payloadPart));
      const payload = JSON.parse(payloadJson);

      const user: User = {
  id: payload.UserId,
  firstName: payload.FirstName,
  lastName: payload.LastName,
  phoneNumber: payload.PhoneNumber,
  userName: payload.unique_name,
  role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
  email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
  isAdmin:
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Admin' ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'SuperAdmin',
};


      return user;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  /**
   * Base64Url => Base64 formatini to'g'rilash
   */
  private padBase64(base64: string): string {
    return base64.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64.length / 4) * 4, '=');
  }

  /**
   * User ma'lumotini backenddan olish (ixtiyoriy)
   */
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/auth/me').pipe(
      tap((user) => {
        this.authStateSubject.next({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      }),
      catchError(() => {
        this.logout();
        return of(null as any);
      })
    );
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      isLoading: loading
    });
  }

  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  get isLoading(): boolean {
    return this.authStateSubject.value.isLoading;
  }
}
