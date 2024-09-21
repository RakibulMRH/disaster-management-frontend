import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true, // Standalone component
  imports: [FormsModule, RouterModule, NgIf], // Include FormsModule and common directives
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  age: number | undefined = undefined;
  errorMessage: string | null = null; // Property to store error messages
  usernameError: string | null = null; // Property to store username error messages

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const userData = {
      username: this.username,
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      age: this.age,
    };

    console.log('Submitting registration data:', userData); // Log the request payload

    this.authService.register(userData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration error', error);
        // Handle registration error
        if (error.error && error.error.message && error.error.message.includes('Username')) {
          this.usernameError = 'Username is already taken.';
        } else {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      }
    );
  }
}
