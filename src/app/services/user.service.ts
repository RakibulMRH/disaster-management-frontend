import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Use environment for API URL

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;  // Base URL from environment

  constructor(private http: HttpClient) {}

  // Get volunteer list
  getVolunteerList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/role/Volunteer`);
  }

  // Fetch user information
  getUserInfo(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  // Update user information
  updateUserInfo(userData: any, userId: number, token: string): Observable<any> {

     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/users/${userId}`, userData, { headers });
  }
}
