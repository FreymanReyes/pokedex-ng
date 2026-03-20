import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // --- Signals del formulario ---
  readonly username = signal('mor_2314');
  readonly password = signal('83r5^_');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly usernameTouched = signal(false);
  readonly passwordTouched = signal(false);

  readonly usernameError = computed(() => {
    if (!this.usernameTouched()) return '';
    if (!this.username()) return 'El usuario es requerido';
    return '';
});

readonly passwordError = computed(() => {
    if (!this.passwordTouched()) return '';
    if (!this.password()) return 'La contraseña es requerida';
    return '';
});

readonly isFormValid = computed(() =>
  !this.usernameError() &&
  !this.passwordError()
);

  onSubmit(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials: LoginRequest = {
      username: this.username(),
      password: this.password()
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/pokemon']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Usuario o contraseña incorrectos');
      }
    });
  }
}