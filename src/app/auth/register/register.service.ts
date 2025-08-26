import { inject, Injectable, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Credentials } from '@app/core/models/credentials.model';
import { AuthService } from '@app/core/services/auth.service';
import { Subject } from 'rxjs';

Injectable();
export class RegisterService {
  private readonly authService = inject(AuthService);

  // sources
  createUser$ = new Subject<Credentials>();
  createUser = toSignal(this.createUser$);

  userCreated = resource({
    params: this.createUser,
    loader: ({ params: credentials }) =>
      this.authService.createAccount(credentials),
  });
}
