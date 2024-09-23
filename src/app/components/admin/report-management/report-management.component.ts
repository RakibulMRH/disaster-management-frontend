import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-report-management',
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css'],
})
export class ReportManagementComponent implements OnInit {
  reportData: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {}

  generateReport(startDate: string, endDate: string): void {
    this.adminService.getDailyReports(startDate, endDate).subscribe(
      (data) => {
        this.reportData = data;
      },
      (error) => {
        console.error('Error generating report', error);
      }
    );
  }
}
