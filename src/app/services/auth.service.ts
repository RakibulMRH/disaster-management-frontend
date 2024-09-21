import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  // Use your environment setup
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Login user
  login(userData: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, userData);
  }

  // Register user
  register(userData: { username: string; email: string; password: string; name: string; phoneNumber?: string; age?: number; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Request password reset via PIN
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/request-password-reset`, { email });
  }

  // Reset password using the provided PIN
  resetPassword(pin: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/reset-password`, { pin, newPassword });
  }
}
