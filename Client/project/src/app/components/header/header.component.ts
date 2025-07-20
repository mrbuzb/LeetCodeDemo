import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">CP</span>
              </div>
              <span class="text-xl font-bold text-gray-900">CodePlatform</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a routerLink="/problems" routerLinkActive="text-primary-600" 
               class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Problems
            </a>
            <a routerLink="/leaderboard" routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Leaderboard
            </a>
            <a routerLink="/about" routerLinkActive="text-primary-600"
               class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              About
            </a>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div *ngIf="(authState$ | async) as authState">
              <!-- Authenticated User -->
              <div *ngIf="authState.isAuthenticated && authState.user; else guestLinks" class="flex items-center space-x-4">
                <a routerLink="/dashboard" 
                   class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </a>
                
                <div *ngIf="authState.user.isAdmin">
                  <a routerLink="/admin" 
                     class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                    Admin
                  </a>
                </div>

                <!-- User dropdown -->
                <div class="relative" [class.open]="isDropdownOpen">
                  <button (click)="toggleDropdown()" 
                          class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                    <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 font-medium text-sm">
                        {{ getUserInitials(authState.user) }}
                      </span>
                    </div>
                    <span class="hidden sm:block text-sm font-medium">{{ authState.user.username }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div *ngIf="isDropdownOpen" 
                       class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <button (click)="logout()" 
                            class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </div>

              <!-- Guest Links -->
              <ng-template #guestLinks>
                <div class="flex items-center space-x-4">
                  <a routerLink="/login" 
                     class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                    Sign in
                  </a>
                  <a routerLink="/register" 
                     class="btn btn-primary text-sm">
                    Sign up
                  </a>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button (click)="toggleMobileMenu()" 
                    class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      [attr.d]="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div *ngIf="isMobileMenuOpen" class="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div class="space-y-1">
            <a routerLink="/problems" (click)="closeMobileMenu()"
               class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Problems
            </a>
            <a routerLink="/leaderboard" (click)="closeMobileMenu()"
               class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              Leaderboard
            </a>
            <a routerLink="/about" (click)="closeMobileMenu()"
               class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
              About
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .open .absolute {
      display: block;
    }
  `]
})
export class HeaderComponent implements OnInit {
  authState$: Observable<any>;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authState$ = this.authService.authState$;
  }

  ngOnInit() {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }

  getUserInitials(user: User): string {
    if (user.firstName && user.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return user.userName ? user.userName[0].toUpperCase() : 'U';
  }
}