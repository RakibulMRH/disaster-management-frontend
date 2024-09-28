import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  pin: string = '';
  newPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.pin || !this.newPassword) {
      this.errorMessage = 'PIN and new password are required.';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.resetPassword(this.pin, this.newPassword).subscribe(
      (response) => {
        this.loading = false;
        this.successMessage = 'Password reset successful! Redirecting to login...';
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // Redirect after 2 seconds
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to reset password. Please try again.';
        console.error('Password reset error', error);
      }
    );
  }
}
