import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterFormComponent } from '@app/auth/register/components/register-form.component';
import { RegisterService } from '@app/auth/register/register.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <app-register-form
      [status]="registerService.status"
      (register)="registerService.createUser$.next($event)"
    />
  `,
  providers: [RegisterService],
  imports: [RegisterFormComponent],
})
export default class RegisterComponent {
  protected readonly registerService = inject(RegisterService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (user) {
        void this.router.navigate(['home']);
      }
    })
  }
}
