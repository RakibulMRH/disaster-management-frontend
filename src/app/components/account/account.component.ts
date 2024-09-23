import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accountForm!: FormGroup;
  user: any;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.verifyUser();
  }

  initializeForm() {
    this.accountForm = this.fb.group({
      name: [''],
      email: [''],
      phoneNumber: [''],
      age: [''],
      currentPassword: [''],
      newPassword: ['']
    });
  }

  verifyUser() {
    if (this.authService.isAuthenticated()) {
      this.user = this.authService.getUser();
      this.userId = this.user?.id || null;

      if (this.userId !== null) {
        this.getUserData();
      } else {
        this.toastr.error('User ID not found');
      }
    } else {
      this.toastr.error('User is not authenticated');
      this.authService.logout();
    }
  }

  getUserData() {
    this.accountService.getUserInfo(this.userId!).subscribe(
      (user) => {
        this.user = user;
        this.accountForm.patchValue({
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age
        });
      },
      (error) => {
        this.toastr.error('Failed to load user information');
      }
    );
  }

  getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  updateProfile() {
    const formValues = this.accountForm.value;

    // Check if password fields are filled correctly
    if (formValues.newPassword && !formValues.currentPassword) {
      this.accountForm.setErrors({ currentPasswordRequired: true });
      this.toastr.error('Current password is required when setting a new password');
      return;
    }

    if (formValues.currentPassword && !formValues.newPassword) {
      this.accountForm.setErrors({ newPasswordRequired: true });
      this.toastr.error('New password is required when current password is provided');
      return;
    }

    const updatedUser = {
      name: formValues.name,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      age: formValues.age,
      currentPassword: formValues.currentPassword,
      newPassword: formValues.newPassword || null
    };

    const token = this.getCookie('token');
    if (!token) {
      this.toastr.error('Authentication token not found');
      return;
    }

    this.accountService.updateUserInfo(updatedUser, this.userId!, token).subscribe(
      (response) => {
          this.toastr.success('Profile updated successfully');
      },
      (error) => {
        if (error.error && error.error.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('Failed to update profile');
        }
      }
    );
  }
}
