import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CrisisService } from '../../services/crisis.service';
import { AuthService } from '../../services/auth.service'; // Assuming you have an AuthService
import { RouterModule } from '@angular/router';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { CrisisData } from '../../services/crisis.service'; // Adjust the import path as necessary

@Component({
  selector: 'app-crisis-management',
  templateUrl: './crisis.component.html',
  styleUrls: ['./crisis.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NgClass, NgIf, NgFor, CurrencyPipe]
})
export class CrisisManagementComponent implements OnInit {
  crisisData: CrisisData = {
    id: 0,
    title: '',
    description: '',
    location: '',
    severity: 'low',
    goal: 0
  };

  imageFile: File | null = null;
  isAdmin = false; // Set this based on user role
  pendingCrises: CrisisData[] = []; // Will hold the list of crises pending approval

  constructor(private crisisService: CrisisService, private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is an admin
    this.isAdmin = this.authService.isAdmin();

    // Fetch pending crises if user is an admin
    if (this.isAdmin) {
      this.fetchPendingCrises();
    }
  }

  handleImageUpload(event: any): void {
    this.imageFile = event.target.files[0];
  }

  submitCrisisForm(): void {
    const formData = new FormData();
    formData.append('title', this.crisisData.title);
    formData.append('description', this.crisisData.description);
    formData.append('location', this.crisisData.location);
    formData.append('severity', this.crisisData.severity);
    formData.append('goal', this.crisisData.goal.toString());

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.crisisService.createCrisis(formData).subscribe(
      (response) => {
        console.log('Crisis created successfully', response);
        // Optionally, reset the form here
      },
      (error) => {
        console.error('Error creating crisis', error);
      }
    );
  }

  fetchPendingCrises(): void {
    this.crisisService.getPendingCrises().subscribe((response) => {
      this.pendingCrises = response;
    });
  }

  approveCrisis(crisisId: number): void {
    this.crisisService.approveCrisis(crisisId).subscribe((response) => {
      console.log('Crisis approved', response);
      this.fetchPendingCrises(); // Refresh the list
    });
  }

  editCrisis(crisisId: number): void {
    // Implement edit logic here
  }
}
