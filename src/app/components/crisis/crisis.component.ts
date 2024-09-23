import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgClass, NgIf, NgFor } from '@angular/common';
import {  CrisisService } from '../../services/crisis.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-crisis-management',
  templateUrl: './crisis.component.html',
  styleUrls: ['./crisis.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, NgClass, NgIf, NgFor, CurrencyPipe]
})

export class CrisisManagementComponent implements OnInit {
  crisisForm: FormGroup;
  imageFile: File | null = null;
  isAdmin: boolean = false;
  pendingCrises: any[] = [];
  editingCrisis: any | null = null;
  crises: any[] = [];

  constructor(
    private crisisService: CrisisService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.crisisForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      severity: ['low', Validators.required],
      goal: [0, Validators.required],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin) {
      this.fetchPendingCrises();
    }
  }

  handleImageUpload(event: any): void {
    this.imageFile = event.target.files[0];
  }

  submitCrisisForm(): void {
    const formData = new FormData();
    formData.append('title', this.crisisForm.get('title')!.value);
    formData.append('description', this.crisisForm.get('description')!.value);
    formData.append('location', this.crisisForm.get('location')!.value);
    formData.append('severity', this.crisisForm.get('severity')!.value);
    formData.append('goal', this.crisisForm.get('goal')!.value.toString());

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.crisisService.createCrisis(formData).subscribe(
      (response) => {
        console.log('Crisis created successfully', response);
        this.crisisForm.reset();
        this.imageFile = null;
      },
      (error) => {
        console.error('Error creating crisis', error);
      }
    );
  }

  fetchPendingCrises(): void {
    this.crisisService.getPendingCrises().subscribe({
      next: (data: any) => {
        this.crises = data.map((crisis: any) => ({
          ...crisis,
          imageUrl: crisis.imageUrl ? `${environment.apiUrl}/${crisis.imageUrl}` : null
        }));
      },
      error: (error) => {
        console.error('Error fetching crises:', error);
      }
    });
  }

    // Get crises list
    getCrisisList() {
      this.crisisService.getCrisisList().subscribe({
        next: (data: any) => {
          this.crises = data.map((crisis: any) => ({
            ...crisis,
            imageUrl: crisis.imageUrl ? `${environment.apiUrl}/${crisis.imageUrl}` : null
          }));
        },
        error: (error) => {
          console.error('Error fetching crises:', error);
        }
      });
    }

  approveCrisis(crisisId: number): void {
    this.crisisService.approveCrisis(crisisId).subscribe(
      (response) => {
        console.log('Crisis approved', response);
        this.fetchPendingCrises();
      },
      (error) => {
        console.error('Error approving crisis', error);
      }
    );
  }

  editCrisis(crisis: any): void {
    this.editingCrisis = {
      ...crisis,
      title: crisis.title || 'No Title',
      description: crisis.description || 'No Description',
      location: crisis.location || 'No Location',
      severity: crisis.severity || 'low',
      goal: crisis.goal || 0,
      requiredHelp: crisis.requiredHelp || 'No Required Help'
    };
  }
  updateCrisis(): void {
    if (this.editingCrisis) {
      this.crisisService
        .editCrisis(this.editingCrisis.id, this.editingCrisis)
        .subscribe(
          (response) => {
            console.log('Crisis updated successfully', response);
            this.fetchPendingCrises();
            this.editingCrisis = null;
          },
          (error) => {
            console.error('Error updating crisis', error);
          }
        );
    }
  }

  cancelEdit(): void {
    this.editingCrisis = null;
  }

  deleteCrisis(crisisId: number): void {
    this.crisisService.deleteCrisis(crisisId).subscribe(
      (response) => {
        console.log('Crisis deleted successfully', response);
        this.fetchPendingCrises();
      },
      (error) => {
        console.error('Error deleting crisis', error);
      }
    );
  }
}
