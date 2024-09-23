import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

export interface CrisisData {
  id: number;
  title: string;
  description: string;
  location: string;
  severity: string;
  goal: number;
}

@Injectable({
  providedIn: 'root'
})
export class CrisisService {
  private apiUrl = environment.apiUrl;  // Base URL from environment

  constructor(private http: HttpClient) {}

  // Get crises list
  getCrisisList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/crises`);
  }

  createCrisis(crisisData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/crises`, crisisData);
  }

  getPendingCrises(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pending`);
  }

  approveCrisis(crisisId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${crisisId}`, {});
  }

  editCrisis(crisisId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${crisisId}`, updatedData);
  }

}
