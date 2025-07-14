import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
    canActivate: [isAuthenticatedGuard],
  },
];
