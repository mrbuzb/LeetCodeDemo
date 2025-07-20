import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">CP</span>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Confirm your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter the confirmation code sent to your email
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="confirmForm" (ngSubmit)="onSubmit()">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">
              Confirmation Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              formControlName="code"
              class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              [class.border-red-500]="confirmForm.get('code')?.invalid && confirmForm.get('code')?.touched"
              placeholder="Enter confirmation code"
              maxlength="6"
            />
            <div *ngIf="confirmForm.get('code')?.invalid && confirmForm.get('code')?.touched" 
                 class="mt-1 text-sm text-red-600">
              Please enter a valid confirmation code
            </div>
          </div>

          <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="text-sm text-red-700">{{ error }}</div>
          </div>

          <div *ngIf="success" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="text-sm text-green-700">{{ success }}</div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="confirmForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Confirming...' : 'Confirm Account' }}
            </button>
          </div>

          <div class="text-center">
            <button
              type="button"
              (click)="resendCode()"
              [disabled]="isLoading"
              class="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ConfirmCodeComponent implements OnInit {
  confirmForm: FormGroup;
  isLoading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.confirmForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.confirmForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const email = localStorage.getItem('email');
      const code = this.confirmForm.get('code')?.value;

      if (!email) {
        this.error = 'No email found. Please register again.';
        this.isLoading = false;
        return;
      }

      this.authService.confirmCode(email, code).subscribe({
        next: (result) => {
          if (!result) {
            this.success = 'Account confirmed successfully! Redirecting...';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.error = 'Invalid confirmation code. Please try again.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error?.message || 'Confirmation failed. Please try again.';
          this.isLoading = false;
        }
      });
    }
  }

  resendCode() {
    this.isLoading = true;
    this.success = '';
    this.error = '';

    const email = localStorage.getItem('email');
    if (!email) {
      this.error = 'No email found. Please register again.';
      this.isLoading = false;
      return;
    }

    this.authService.sendCode(email).subscribe({
      next: (res) => {
        if (res) {
          this.success = 'Confirmation code resent to your email.';
        } else {
          this.error = 'Failed to resend confirmation code.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error?.message || 'Failed to resend confirmation code.';
        this.isLoading = false;
      }
    });
  }
}
