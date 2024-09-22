import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true, // Standalone component
  imports: [CommonModule,RouterModule, FormsModule, ReactiveFormsModule, NgIf], // Import CommonModule and other necessary modules
  selector: 'app-auth-pages',
  templateUrl: './auth-pages.component.html',
  styleUrls: ['./auth-pages.component.css'],
})
export class AuthPagesComponent implements OnInit {
  currentPage: 'login' | 'register' | 'forgot-password' | 'reset-password' = 'login';

  // Login form
  usernameOrEmail: string = '';
  password: string = '';

  // Register form
  username: string = '';
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  age: number | null = null;

  // Forgot password form
  forgotPasswordForm: FormGroup;
  loading: boolean = false;

  // Reset password form
  pin: string = '';
  newPassword: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      this.currentPage = segments[0].path as 'login' | 'register' | 'forgot-password' | 'reset-password';
    });
  }

  onSubmit() {
    // Implement form submission logic for each page
    switch (this.currentPage) {
      case 'login':
        // Handle login
        break;
      case 'register':
        // Handle registration
        break;
      case 'forgot-password':
        // Handle forgot password
        break;
      case 'reset-password':
        // Handle reset password
        break;
    }
  }
}
