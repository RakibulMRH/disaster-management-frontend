import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.apiUrl;  // Base URL from environment

  constructor(private http: HttpClient) {}
  // Get chart data for funds and expenses
  getFundsExpensesChart(startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/reports/daily-funds-expenses?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get(url);
  }
}
