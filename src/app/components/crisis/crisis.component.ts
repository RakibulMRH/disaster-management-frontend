import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { CrisisService } from '../../services/crisis.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-crisis-management',
  templateUrl: './crisis.component.html',
  styleUrls: ['./crisis.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, NgClass, NgIf, NgFor, CurrencyPipe],
})
export class CrisisManagementComponent implements OnInit {
  crisisForm: FormGroup;
  imageFile: File | null = null;
  isAdmin: boolean = false;
  pendingCrises: any[] = [];
  editingCrisis: any | null = null;
  crises: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  submissionMessage: string = '';


  constructor(
    private crisisService: CrisisService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.crisisForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      location: ['', [Validators.required, Validators.minLength(3)]],
      severity: ['low', Validators.required],
      goal: [0, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.getCrisisList();
    if (this.isAdmin) {
      this.fetchPendingCrises();
    }
  }

  handleImageUpload(event: any): void {
    this.imageFile = event.target.files[0];
  }

  submitCrisisForm(): void {
    if (this.crisisForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.submissionMessage = '';

    const formData = new FormData();
    Object.keys(this.crisisForm.value).forEach(key => {
      formData.append(key, this.crisisForm.get(key)!.value);
    });

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    } else if (this.editingCrisis && this.editingCrisis.imageUrl) {
      formData.append('imageUrl', this.editingCrisis.imageUrl);
    }


    const observable = this.editingCrisis
      ? this.crisisService.editCrisis(this.editingCrisis.id, formData)
      : this.crisisService.createCrisis(formData);

    observable.subscribe({
      next: (response) => {
        console.log('Crisis operation successful', response);
        this.submissionMessage = this.editingCrisis ? 'Crisis updated successfully!' : 'Crisis reported successfully!';
        this.resetForm();
        this.getCrisisList();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in crisis operation', error);
        this.errorMessage = 'Failed to submit crisis. Please try again.';
        this.isLoading = false;
      }
    });
  }

  fetchPendingCrises(): void {
    this.isLoading = true;
    this.crisisService.getPendingCrises().subscribe({
      next: (data: any) => {
        this.pendingCrises = this.processCrisisData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching pending crises:', error);
        this.errorMessage = 'Failed to fetch pending crises.';
        this.isLoading = false;
      }
    });
  }

  getCrisisList(): void {
    this.isLoading = true;
    this.crisisService.getCrisisList().subscribe({
      next: (data: any) => {
        this.crises = this.processCrisisData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching full crisis list:', error);
        this.errorMessage = 'Failed to fetch crisis list.';
        this.isLoading = false;
      }
    });
  }

  processCrisisData(data: any[]): any[] {
    return data.map((crisis: any) => ({
      ...crisis,
      imageUrl: crisis.imageUrl ? `${environment.apiUrl}/${crisis.imageUrl}` : null,
    }));
  }

  approveCrisis(crisisId: number): void {
    this.isLoading = true;
    this.crisisService.approveCrisis(crisisId).subscribe({
      next: (response) => {
        console.log('Crisis approved', response);
        this.fetchPendingCrises();
        this.getCrisisList();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error approving crisis', error);
        this.errorMessage = 'Failed to approve crisis.';
        this.isLoading = false;
      }
    });
  }

  editCrisis(crisis: any): void {
    this.editingCrisis = crisis;
    this.crisisForm.patchValue({
      title: crisis.title,
      description: crisis.description,
      location: crisis.location,
      severity: crisis.severity,
      goal: crisis.goal,
      imageUrl: crisis.imageUrl,
    });
    this.imageFile = null;

    window.scrollTo(0, 0);
  }

  resetForm(): void {
    this.crisisForm.reset({
      title: '',
      description: '',
      location: '',
      severity: 'low',
      goal: 0,
      imageUrl: '',
    });
    this.imageFile = null;
    this.editingCrisis = null;
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteCrisis(crisisId: number): void {
    this.isLoading = true;
    this.crisisService.deleteCrisis(crisisId).subscribe({
      next: (response) => {
        console.log('Crisis deleted successfully', response);
        this.getCrisisList();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting crisis', error);
        this.errorMessage = 'Failed to delete crisis.';
        this.isLoading = false;
      }
    });
  }
}
