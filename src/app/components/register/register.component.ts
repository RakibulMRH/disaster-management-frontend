import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  name: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  age: number | undefined = undefined;
  errorMessage: string | null = null;
  usernameError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.usernameError = null;

    const userData = {
      username: this.username,
      name: this.name,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      age: this.age,
    };

    console.log('Submitting registration data:', userData);

    this.authService.register(userData).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Registration error', error);
        if (error.status === 400) {
          if (error.error && error.error.message) {
            if (error.error.message.includes('username')) {
              this.usernameError = 'Username is already taken.';
            } else {
              this.errorMessage = error.error.message;
            }
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }
}
