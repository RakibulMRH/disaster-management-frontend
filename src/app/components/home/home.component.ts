import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service'; // Import HomeService
import { environment } from '../../../environments/environment'; // Import environment
import { interval, Subscription } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';
import { TransferState, makeStateKey } from '@angular/core';

const TOTAL_DONATIONS_KEY = makeStateKey<number>('totalDonations');
const CRISES_KEY = makeStateKey<any[]>('crises');
const VOLUNTEERS_KEY = makeStateKey<any[]>('volunteers');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, ReactiveFormsModule],
})
export class HomeComponent implements OnInit, OnDestroy {
  totalDonations: number = 0;
  totalVolunteers: number = 0;
  chart: any;
  crises: any[] = [];
  volunteers: any[] = [];
  private donationSubscription: Subscription | null = null;

  constructor(
    private homeService: HomeService,
    private router: Router,
    @Inject(TransferState) private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.totalDonations = this.transferState.get(TOTAL_DONATIONS_KEY, 0);
    this.crises = this.transferState.get(CRISES_KEY, []);
    this.volunteers = this.transferState.get(VOLUNTEERS_KEY, []);

    if (isPlatformServer(this.platformId)) {
      this.fetchDataForSSR();
    } else {
      this.startPolling();
      this.getCrisisList();
      this.getVolunteerList();
      this.getFundsExpensesChart();
    }
  }

  ngOnDestroy(): void {
    if (this.donationSubscription) {
      this.donationSubscription.unsubscribe();
    }
  }

  fetchDataForSSR(): void {
    this.homeService.getTotalDonations().pipe(timeout(5000)).subscribe(
      data => {
        this.totalDonations = data;
        this.transferState.set(TOTAL_DONATIONS_KEY, data);
      },
      error => console.error('Error fetching total donations', error)
    );

    this.homeService.getCrisisList().pipe(timeout(5000)).subscribe(
      data => {
        this.crises = data.map((crisis: any) => ({
          ...crisis,
          imageUrl: crisis.imageUrl ? `${environment.apiUrl}/${crisis.imageUrl}` : null
        }));
        this.transferState.set(CRISES_KEY, this.crises);
      },
      error => console.error('Error fetching crises', error)
    );

    this.homeService.getVolunteerList().pipe(timeout(5000)).subscribe(
      data => {
        this.volunteers = data.filter((volunteer: any) => volunteer.status === 'unassigned');
        this.totalVolunteers = this.volunteers.length;
        this.transferState.set(VOLUNTEERS_KEY, this.volunteers);
      },
      error => console.error('Error fetching volunteers', error)
    );
  }

  startPolling(): void {
    this.donationSubscription = interval(5000) // Poll every 5 seconds
      .pipe(
        switchMap(() => this.homeService.getTotalDonations().pipe(timeout(5000)))
      )
      .subscribe(
        data => this.totalDonations = data,
        error => console.error('Error fetching total donations', error)
      );
  }

  // Get crises list
  getCrisisList() {
    this.homeService.getCrisisList().pipe(timeout(5000)).subscribe({
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

  // Get volunteer list
  getVolunteerList() {
    this.homeService.getVolunteerList().pipe(timeout(5000)).subscribe((data: any) => {
      this.volunteers = data.filter((volunteer: any) => volunteer.status === 'unassigned');
      this.totalVolunteers = this.volunteers.length;
    });
  }

  // Get chart for funds and expenses with current date
  getFundsExpensesChart() {
    const startDate = '2024-09-01'; // Set start date to 2024-09-01
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    this.homeService.getFundsExpensesChart(startDate, currentDate).pipe(timeout(5000)).subscribe((data: any) => {
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
