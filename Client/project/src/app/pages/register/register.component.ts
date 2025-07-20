import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../types';

@Component({
  selector: 'app-register',
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
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/login" class="font-medium text-primary-600 hover:text-primary-500 ml-1">
              sign in to your existing account
            </a>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          formControlName="firstName"
          class="input mt-1"
          placeholder="First name"
        />
      </div>
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          formControlName="lastName"
          class="input mt-1"
          placeholder="Last name"
        />
      </div>
    </div>

    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username
      </label>
      <input
        id="username"
        name="username"
        type="text"
        formControlName="username"
        class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
        placeholder="Choose a username"
      />
      <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" 
           class="mt-1 text-sm text-red-600">
        Username is required
      </div>
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autocomplete="email"
        formControlName="email"
        class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
        placeholder="Enter your email"
      />
      <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
           class="mt-1 text-sm text-red-600">
        Please enter a valid email address
      </div>
    </div>

    <div>
      <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        type="text"
        formControlName="phoneNumber"
        class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        placeholder="Enter your phone number"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="new-password"
        formControlName="password"
        class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
        placeholder="Create a password"
      />
      <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
           class="mt-1 text-sm text-red-600">
        Password must be at least 6 characters long
      </div>
    </div>

    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        formControlName="confirmPassword"
        class="input mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
        placeholder="Confirm your password"
      />
      <div *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched" 
           class="mt-1 text-sm text-red-600">
        Passwords do not match
      </div>
    </div>
  </div>

  <div class="flex items-center">
    <input
      id="agree-terms"
      name="agree-terms"
      type="checkbox"
      formControlName="agreeTerms"
      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
    />
    <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
      I agree to the 
      <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
      and 
      <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
    </label>
  </div>

  <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4">
    <div class="text-sm text-red-700">{{ error }}</div>
  </div>

  <div>
    <button
      type="submit"
      [disabled]="registerForm.invalid || isLoading"
      class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      {{ isLoading ? 'Creating account...' : 'Create account' }}
    </button>
  </div>
</form>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Kichik harf
    password: ['', [Validators.required, Validators.minLength(6)]],
    username: ['', [Validators.required]],
    firstName: [''],
    lastName: [''],
    phoneNumber: [''],
    confirmPassword: ['', [Validators.required]],
    agreeTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('Password');
    const confirmPassword = form.get('ConfirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit() {
  if (this.registerForm.valid) {
    this.isLoading = true;
    
    // const userData: RegisterRequest = {
    //   email: this.registerForm.value.email,
    //   password: this.registerForm.value.password,
    //   username: this.registerForm.value.username,
    //   firstName: this.registerForm.value.firstName || undefined,
    //   lastName: this.registerForm.value.lastName || undefined
    // };

    console.log('Registering user with data:', this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe({
      next: (result) => {
        console.log('REGISTER SUCCESS:', result);
        if (result) {
          this.router.navigate(['/confirm-code']);
        } else {
          this.error = 'Registration failed.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.log('REGISTER ERROR:', err);
        console.log('ERROR BODY:', err.error);
        this.error = err?.error?.message || err?.message || 'Registration failed';
        this.isLoading = false;
      }
    });
  }
}

}
