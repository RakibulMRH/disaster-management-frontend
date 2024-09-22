// src/app/components/donation/donation.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DonationService } from '../../services/donation.service';
import { ReportService } from '../../services/report.service';
import { CrisisService } from '../../services/crisis.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { CurrencyPipe } from '@angular/common';
import { interval, Subscription, EMPTY } from 'rxjs';
import { switchMap, timeout, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, NgClass, NgIf, NgFor, CurrencyPipe]
})
export class DonationComponent implements OnInit, OnDestroy {
  // Donation Form Fields
  donorName: string = '';
  amount: number | null = null;
  selectedCrisisId: number | null = null;
  notes: string = '';

  // List of Crises
  crises: any[] = [];

  // All-Time Donations
  donations: any[] = [];
  private donationSubscription: Subscription | null = null;

  // Bar Chart
  chart: any;

  // Crisis Funds
  crisisFunds: { [key: number]: number } = {};
  crisisGoals: { [key: number]: number } = {};

  // Loading Indicators
  isLoadingCrises: boolean = true;
  isLoadingDonations: boolean = true;
  isLoadingChart: boolean = true;

  // Polling Configuration
  private POLLING_INTERVAL_MS = 15000; // 15 seconds

  // ViewChild for the canvas
  @ViewChild('fundsChart') fundsChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private donationService: DonationService,
    private crisisService: CrisisService,
    private reportService: ReportService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.stopPollingDonations();
  }

  /**
   * Load initial data independently to allow immediate rendering.
   */
  loadInitialData(): void {
    this.loadCrisisList();
    this.loadAllDonations();
    this.loadFundsExpensesChart();
  }

  /**
   * Load the list of crises for the select dropdown.
   */
  loadCrisisList(): void {
    this.crisisService.getCrisisList().pipe(
      timeout(5000),
      catchError(error => {
        console.error('Error fetching crises:', error);
        this.isLoadingCrises = false;
        return EMPTY;
      })
    ).subscribe({
      next: (data: any[]) => {
        this.crises = data;
        this.isLoadingCrises = false;
        this.loadCrisisFunds(); // Load crisis funds after crises are loaded
        if (isPlatformBrowser(this.platformId)) {
          this.startPollingDonations(); // Start polling only on the browser
        }
      }
    });
  }

  /**
   * Load all-time donations.
   */
  loadAllDonations(): void {
    this.donationService.getAllDonations().pipe(
      timeout(5000),
      catchError(error => {
        console.error('Error fetching donations:', error);
        this.isLoadingDonations = false;
        return EMPTY;
      })
    ).subscribe({
      next: (data: any[]) => {
        this.donations = data;
        this.isLoadingDonations = false;
      }
    });
  }

  /**
   * Load data for the bar chart.
   */
  loadFundsExpensesChart(): void {
    const startDate = '2024-09-01'; // Example start date
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD
    this.reportService.getFundsExpensesChart(startDate, currentDate).pipe(
      timeout(5000),
      catchError(error => {
        console.error('Error fetching chart data:', error);
        this.isLoadingChart = false;
        return EMPTY;
      })
    ).subscribe({
      next: (data: any[]) => {
        if (data.length) {
          this.reportService.getFundsExpensesChart(startDate, currentDate).pipe(timeout(5000)).subscribe((data: any) => {
            const dates = data.map((item: any) => new Date(item.date).toLocaleDateString());
            const funds = data.map((item: any) => item.totalFunds);
            const expenses = data.map((item: any) => item.totalExpenses);
            this.renderChart(dates, funds, expenses);
          });
        }
        this.isLoadingChart = false;
      }
    });
  }

  /**
   * Start polling donations at defined intervals.
   */
  startPollingDonations(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Do not start polling on the server
    }

    this.donationSubscription = interval(this.POLLING_INTERVAL_MS)
      .pipe(
        switchMap(() => this.donationService.getAllDonations().pipe(
          timeout(5000),
          catchError(error => {
            console.error('Error polling donations:', error);
            return EMPTY; // Continue polling despite errors
          })
        ))
      )
      .subscribe({
        next: (data: any[]) => {
          this.donations = data;
        }
      });
  }

  /**
   * Stop polling donations.
   */
  stopPollingDonations(): void {
    if (this.donationSubscription) {
      this.donationSubscription.unsubscribe();
      this.donationSubscription = null;
    }
  }

  /**
   * Handle form submission.
   */
  onSubmit(form: NgForm): void {
    if (form.invalid || this.selectedCrisisId === null) {
      alert('Please fill in all required fields.');
      return;
    }

    const donationPayload = {
      donorName: this.donorName,
      amount: this.amount,
      crisisId: this.selectedCrisisId,
      notes: this.notes
    };

    this.donationService.submitDonation(donationPayload).subscribe({
      next: (response) => {
        alert('Thank you for your donation!');
        form.resetForm();
        this.loadAllDonations();
        this.loadCrisisFunds(); // Update crisis funds after donation
        if (this.chart) {
          this.updateChart(); // Optionally update the chart
        }
      },
      error: (error) => {
        console.error('Error submitting donation:', error);
        alert('There was an error submitting your donation. Please try again.');
      }
    });
  }

  /**
   * Render the bar chart.
   */
 // Render the chart
 renderChart(dates: string[], funds: number[], expenses: number[]): void {
  if (this.chart) {
    this.chart.destroy();
  }

  // Delay chart creation to ensure the canvas is in the DOM
  setTimeout(() => {
    const context = this.fundsChart.nativeElement.getContext('2d');
    if (!context) {
      console.error("Failed to get canvas context.");
      return;
    }

    this.chart = new Chart(context, {
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
  }, 0);
}

  /**
   * Update the bar chart after a new donation.
   */
  updateChart(): void {
    // Re-fetch chart data
    this.loadFundsExpensesChart();
  }

  /**
   * Load total funds for each crisis.
   */
  loadCrisisFunds(): void {
    this.crises.forEach(crisis => {
      this.donationService.getTotalFund(crisis.id).pipe(
        timeout(5000),
        catchError(error => {
          console.error(`Error fetching funds for crisis ID ${crisis.id}:`, error);
          this.crisisFunds[crisis.id] = 0;
          this.crisisGoals[crisis.id] = 1000; // Default goal on error
          return EMPTY;
        })
      ).subscribe({
        next: (data: any) => {
          this.crisisFunds[crisis.id] = data.totalFund || 0;
          this.crisisGoals[crisis.id] = data.goal || 1000; // Assuming a default goal if not provided
        }
      });
    });
  }

  /**
   * Calculate progress percentage for a crisis.
   */
  getProgress(crisisId: number): number {
    const fund = this.crisisFunds[crisisId] || 0;
    const goal = this.crisisGoals[crisisId] || 1; // Prevent division by zero
    return Math.min((fund / goal) * 100, 100);
  }

  /**
   * Navigate to other routes if needed.
   */
  navigateToCrisis(): void {
    this.router.navigate(['/crisis']);
  }

  navigateToVolunteer(): void {
    this.router.navigate(['/volunteer']);
  }
}
