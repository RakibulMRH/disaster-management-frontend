import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;  // Base URL from environment

  constructor(private http: HttpClient) {}

  // Get list of volunteers
  getVolunteers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/role/Volunteer`);
  }

  // Get list of crises (pending or all)
  getCrises(status: string = ''): Observable<any> {
    const url = status ? `${this.apiUrl}/crises?status=${status}` : `${this.apiUrl}/crises`;
    return this.http.get(url);
  }

  // Approve crisis
  approveCrisis(crisisId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/crises/${crisisId}/approve`, {});
  }

  // Change crisis severity or status
  updateCrisis(crisisId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/crises/${crisisId}`, data);
  }

  // Generate daily report for funds and expenses
  getDailyReports(startDate: string, endDate: string): Observable<any> {
    const url = `${this.apiUrl}/reports/daily-funds-expenses?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get(url);
  }
}
