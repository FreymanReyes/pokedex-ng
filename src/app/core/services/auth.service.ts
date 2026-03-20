import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL = 'https://fakestoreapi.com';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USERNAME_KEY = 'auth_username';

  // --- Signals ---
  private readonly _currentUser = signal<AuthUser | null>(
    this.loadUserFromStorage()
  );

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);


  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(
      `${this.API_URL}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        const user: AuthUser = {
          username: credentials.username,
          token: response.token
        };
        this.saveUserToStorage(user);
        this._currentUser.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private saveUserToStorage(user: AuthUser): void {
    localStorage.setItem(this.TOKEN_KEY, user.token);
    localStorage.setItem(this.USERNAME_KEY, user.username);
  }

  private loadUserFromStorage(): AuthUser | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const username = localStorage.getItem(this.USERNAME_KEY);
    if (token && username) {
      return { token, username };
    }
    return null;
  }
}