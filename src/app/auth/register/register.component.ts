import { Component, inject } from '@angular/core';
import { RegisterFormComponent } from '@app/auth/register/components/register-form.component';
import { RegisterService } from '@app/auth/register/register.service';

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
}
