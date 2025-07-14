import { Routes } from '@angular/router';
import { RegisterService } from '@app/auth/register/register.service';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
];
