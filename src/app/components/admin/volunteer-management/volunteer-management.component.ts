import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-volunteer-management',
  templateUrl: './volunteer-management.component.html',
  styleUrls: ['./volunteer-management.component.css'],
})
export class VolunteerManagementComponent implements OnInit {
  volunteers: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getVolunteers().subscribe(
      (data) => {
        this.volunteers = data;
      },
      (error) => {
        console.error('Error fetching volunteers', error);
      }
    );
  }
}
