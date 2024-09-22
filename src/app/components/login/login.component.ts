import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule in the component
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common'; // Import common directives

@Component({
  selector: 'app-login',
  standalone: true, // Standalone component
  imports: [FormsModule, RouterModule, NgIf], // Include FormsModule and common directives
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string | null = null; // Property to store error messages
  currentPage: string = 'login';
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login({ usernameOrEmail: this.usernameOrEmail, password: this.password }).subscribe(
      (response) => {
        console.log('Login successful', response);
        // Store the token and user information in localStorage
        this.setCookie('token', response.token, 1); // Set cookie for 1 day

        // Redirect based on role
        if (response.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (response.user.role === 'Volunteer') {
          this.router.navigate(['/volunteer-dashboard']);
        }
      },
      (error) => {
        console.error('Login error', error);
        // Handle login error
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    );
  }

  setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
}
