import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL
import { AuthService } from './auth.service';

export interface CrisisData {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  severity: string;
  requiredHelp: string | null;
  status: string;
  dateReported: string;
  dateApproved: string | null;
  goal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CrisisService {
  private apiUrl = environment.apiUrl;  // Base URL from environment
  private authservice: AuthService;

  constructor(private http: HttpClient, authservice: AuthService) {
    this.authservice = authservice;
  }

  // Get crises list
  getCrisisList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crises`);
  }

  createCrisis(crisisData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crises`, crisisData);
  }

  getPendingCrises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crises/pending`);
  }

  approveCrisis(crisisId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authservice.getToken()}`,
      'Accept': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/admin/crises/${crisisId}/approve`, {}, { headers });
  }

  updateCrisis(crisisId: number, updatedData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authservice.getToken()}`,
      'Accept': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/admin/crises/${crisisId}`, updatedData, { headers });
  }



  editCrisis(crisisId: number, updatedData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authservice.getToken()}`,
      'Accept': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/crises/${crisisId}`, updatedData, { headers });
  }

  deleteCrisis(crisisId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authservice.getToken()}`,
      'Accept': 'application/json'
    });
    return this.http.delete(`${this.apiUrl}/admin/crises/${crisisId}`, {headers });
  }

}
