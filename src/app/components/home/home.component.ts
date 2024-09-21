import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service'; // Import HomeService

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, ReactiveFormsModule],
})
export class HomeComponent implements OnInit {
  totalDonations: number = 0;
  chart: any;
  crises: any[] = [];
  volunteers: any[] = [];

  constructor(private homeService: HomeService, private router: Router) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getTotalDonations();
    this.getCrisisList();
    this.getVolunteerList();
    this.getFundsExpensesChart();
  }

  // Get total donations
  getTotalDonations() {
    this.homeService.getTotalDonations().subscribe((data: any) => {
      this.totalDonations = data.total;
    });
  }

  // Get crises list
  getCrisisList() {
    this.homeService.getCrisisList().subscribe((data: any) => {
      this.crises = data.crises;
    });
  }

  // Get volunteer list
  getVolunteerList() {
    this.homeService.getVolunteerList().subscribe((data: any) => {
      this.volunteers = data.volunteers;
    });
  }

  // Get chart for funds and expenses with current date
  getFundsExpensesChart() {
    const startDate = '2024-09-01'; // Set start date to 2024-09-01
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    this.homeService.getFundsExpensesChart(startDate, currentDate).subscribe((data: any) => {
      const dates = data.map((item: any) => new Date(item.date).toLocaleDateString());
      const funds = data.map((item: any) => item.totalFunds);
      const expenses = data.map((item: any) => item.totalExpenses);
      this.renderChart(dates, funds, expenses);
    });
  }

  // Render the chart
  renderChart(dates: string[], funds: number[], expenses: number[]) {
    this.chart = new Chart('fundsChart', {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          { label: 'Total Funds', data: funds, backgroundColor: 'green' },
          { label: 'Total Expenses', data: expenses, backgroundColor: 'red' }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          title: {
            display: true,
            text: 'Funds vs Expenses'
          }
        }
      }
    });
  }

  navigateToDonation() {
    this.router.navigate(['/donation']);
  }

  navigateToCrisis() {
    this.router.navigate(['/crisis']);
  }

  navigateToVolunteer() {
    this.router.navigate(['/volunteer']);
  }
}
