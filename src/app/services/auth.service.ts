import { Injectable, PLATFORM_ID , Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';  // Use your environment setup
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'token';  // Key for token in localStorage
  private readonly USER_KEY = 'user';    // Key for user data in sessionStorage

  constructor( @Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private router: Router) {}

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

  // Store token in localStorage
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      localStorage.setItem(this.TOKEN_KEY, token);
      document.cookie = `token=${token}; path=/`;
    }
  }
  // Retrieve token from localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // isAdmin
  isAdmin(): boolean {
    const user = this.getUser();
    if(user && user.role === 'Admin')
      return true;
    return false;
  }

  // isVolunteer
  isVolunteer(): boolean {
    const user = this.getUser();
    if(user && user.role === 'Volunteer')
      return true;
    return false;
  }


  // Store user data in sessionStorage
  setUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const userSession = {
        name: user.name,
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        age: user.age,
      };
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(userSession));
    }
  }

  // Retrieve user data from sessionStorage
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = sessionStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }


  // Logout user and clear storage
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }
    this.router.navigate(['/login']);
  }


  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();  // Returns true if the token exists
  }
}
