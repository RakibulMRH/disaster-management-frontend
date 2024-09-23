import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf, Location } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private location: Location) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}
  goBack() {
    this.location.back() // Or any other specific route
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.requestPasswordReset(this.forgotPasswordForm.value.email).subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'A reset PIN has been sent to your email!';
          // Redirect to reset-password page
          this.router.navigate(['/reset-password']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to send reset email. Please check your email address.';
          console.error('Request reset password error', error);
        }
      );
    }
  }
}
