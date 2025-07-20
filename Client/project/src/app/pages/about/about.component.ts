import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CodePlatform
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering developers to master coding skills through comprehensive challenges, 
            algorithm problems, and data structure exercises.
          </p>
        </div>

        <!-- Mission Section -->
        <div class="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p class="text-lg text-gray-700 mb-4">
            At CodePlatform, we believe that every developer deserves access to high-quality 
            coding challenges that help them grow their skills and advance their careers. 
            Our platform is designed to provide a comprehensive learning experience that 
            combines theoretical knowledge with practical application.
          </p>
          <p class="text-lg text-gray-700">
            Whether you're preparing for technical interviews, looking to improve your 
            problem-solving skills, or simply want to stay sharp with regular coding practice, 
            CodePlatform offers the tools and resources you need to succeed.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Curated Problems</h3>
            <p class="text-gray-600">
              Hand-picked coding challenges covering algorithms, data structures, and more
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Real-time Feedback</h3>
            <p class="text-gray-600">
              Get instant feedback on your solutions with detailed test results
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p class="text-gray-600">
              Monitor your progress and compete with others on the leaderboard
            </p>
          </div>
        </div>

        <!-- Team Section -->
        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
          <p class="text-lg text-gray-700 text-center mb-8">
            CodePlatform is built by a passionate team of developers and educators 
            who understand the challenges of learning to code and preparing for technical interviews.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-primary-600 font-bold text-xl">JD</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">John Doe</h3>
              <p class="text-gray-600">Founder & CEO</p>
            </div>
            
            <div class="text-center">
              <div class="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-secondary-600 font-bold text-xl">JS</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Jane Smith</h3>
              <p class="text-gray-600">CTO</p>
            </div>
            
            <div class="text-center">
              <div class="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-yellow-600 font-bold text-xl">MB</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Mike Brown</h3>
              <p class="text-gray-600">Lead Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AboutComponent {}