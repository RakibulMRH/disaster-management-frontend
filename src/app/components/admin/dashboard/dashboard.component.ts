import { Component, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class AdminDashboardComponent {
  constructor(private authService: AuthService, @Inject(Router) private router: Router) {}

  logout(): void {
    this.authService.logout();  // Call the logout method in the AuthService
    this.router.navigate(['/login']);  // Redirect to login page after logging out
  }
}
