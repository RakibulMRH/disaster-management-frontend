import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router
import { CrisisService } from '../../../services/crisis.service';

@Component({
  selector: 'app-crisis-management',
  templateUrl: './crisis-management.component.html',
  styleUrls: ['./crisis-management.component.css']
})
export class CrisisManagementComponent implements OnInit {
  crisisForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  submissionMessage = '';
  editingCrisis: any = null;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private crisisService: CrisisService,
    private router: Router // Inject Router
  ) {
    this.crisisForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      severity: ['', Validators.required],
      goal: ['', Validators.required],
      dateReported: ['', Validators.required],
      dateApproved: ['']
    });
  }

  ngOnInit(): void {
    //set it to go crisis page
    this.router.navigate(['/crises']);
  }
}
