import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

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


}
