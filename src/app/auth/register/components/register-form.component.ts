import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatInputModule, MatPrefix, } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterStatus } from '@app/auth/register/register.service';
import { Credentials } from '@app/core/models/credentials.model';

@Component({
  selector: 'app-register-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill">
        <mat-label>email</mat-label>
        <input
          matNativeControl
          formControlName="email"
          type="email"
          placeholder="email"
        />
        <mat-icon matPrefix>email</mat-icon>
      </mat-form-field>
      <mat-form-field>
        <mat-label>password</mat-label>
        <input
          matNativeControl
          formControlName="password"
          data-test="create-password-field"
          type="password"
          placeholder="password"
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>
      <mat-form-field>
        <mat-label>confirm password</mat-label>
        <input
          matNativeControl
          formControlName="confirmPassword"
          type="password"
          placeholder="confirm password"
        />
        <mat-icon matPrefix>lock</mat-icon>
      </mat-form-field>

      <button
        mat-raised-button
        color="accent"
        type="submit"
        [disabled]="status() === 'creating'"
      >
        Submit
      </button>
    </form>
  `,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatPrefix,
    MatFormField,
    MatButton,
  ],
  styles: `
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    button {
      width: 100%;
    }

    mat-error {
      margin: 5px 0;
    }

    mat-spinner {
      margin: 1rem 0;
    }
  `,
})
export class RegisterFormComponent {
  status = input.required<RegisterStatus>();
  register = output<Credentials>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.valid) {
      const { confirmPassword, ...credentials } = this.form.getRawValue();
      this.register.emit(credentials);
    }
  }
}
