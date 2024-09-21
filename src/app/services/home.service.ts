import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiUrl;  // Base URL from environment

  constructor(private http: HttpClient) {}

  // Get total donations
  getTotalDonations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/donations/total`);
  }

  // Get crises list
  getCrisisList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crises`);
  }

  // Get volunteer list
  getVolunteerList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/role/Volunteer`);
  }

  // Get chart data for funds and expenses
  getFundsExpensesChart(startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/reports/daily-funds-expenses?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get(url);
  }
}
