import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.LoginPage)
  },
  {
    path: 'pokemon',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/pokemon/pages/pokemon-list/pokemon-list')
        .then(m => m.PokemonListPage)
  },
  {
    path: '**',
    redirectTo: 'pokemon'
  }
];
