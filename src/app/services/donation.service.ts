// src/app/services/donation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = environment.apiUrl; // Replace with your actual backend API URL

  constructor(private http: HttpClient) { }

  // Fetch list of crises
  getCrisisList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/crises`);
  }

  // Fetch all donations
  getAllDonations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/donations/all`);
  }

  // Submit a new donation
  submitDonation(donation: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/donations`, donation);
  }

  // Get total fund for a specific crisis
  getTotalFund(crisisId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/donations/total-fund/${crisisId}`);
  }


}
