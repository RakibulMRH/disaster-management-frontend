import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

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

  constructor(private http: HttpClient) {}

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
    return this.http.put(`${this.apiUrl}/admin/crises/${crisisId}/approve`, {
      //send bearer token in the header
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }



  editCrisis(crisisId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${crisisId}`, updatedData);
  }

  deleteCrisis(crisisId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${crisisId}`);
  }

}
