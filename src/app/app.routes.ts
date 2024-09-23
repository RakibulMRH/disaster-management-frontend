import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { DonationComponent } from './components/donation/donation.component';
import { AccountComponent } from './components/account/account.component';
import { CrisisManagementComponent } from './components/crisis/crisis.component';
import { VolunteerManagementComponent } from './components/admin/volunteer-management/volunteer-management.component';
import { CrisisManagementComponent as AdminCrisisManagementComponent } from './components/admin/crisis-management/crisis-management.component';
import { ReportManagementComponent } from './components/admin/report-management/report-management.component';
import { AdminDashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent },
  { path: 'donation', component: DonationComponent },
  { path: 'account', component: AccountComponent },
  { path: 'crisis', component: CrisisManagementComponent },
  // Admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],  // Protected route for Admin only
    data: { role: 'Admin' }
  },
  {
    path: 'admin/volunteer',
    component: VolunteerManagementComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/crisis',
    component: AdminCrisisManagementComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin/report',
    component: ReportManagementComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Catch-all route for undefined routes
];
