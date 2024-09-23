import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { appRoutes } from './app.routes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    importProvidersFrom(Component, ToastrModule.forRoot(),BrowserAnimationsModule, ActivatedRoute, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, NgIf, CommonModule, RouterModule),
  ],
};
