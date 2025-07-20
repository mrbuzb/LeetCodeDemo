import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated || !authState.user) {
          this.router.navigate(['/login']);
          return false;
        }
        
        if (authState.user.isAdmin) {
          return true;
        }
        
        this.router.navigate(['/dashboard']);
        return false;
      })
    );
  }
}