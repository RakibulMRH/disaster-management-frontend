import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, CommonModule } from '@angular/common';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      NgIf,
      CommonModule,
      RouterModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot()
    ),
  ],
};
