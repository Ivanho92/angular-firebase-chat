import { inject, Injectable, signal } from '@angular/core';
import { Credentials } from '@app/core/models/credentials.model';
import { AuthService } from '@app/core/services/auth.service';
import { connect } from 'ngxtension/connect';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';

export type RegisterStatus = 'pending' | 'creating' | 'success' | 'error';

interface RegisterState {
  status: RegisterStatus;
}

Injectable();
export class RegisterService {
  private readonly authService = inject(AuthService);

  // state
  private state = signal<RegisterState>({
    status: 'pending',
  });

  // selectors
  status = this.state().status;

  // sources
  error$ = new Subject<unknown>();
  createUser$ = new Subject<Credentials>();

  userCreated$ = this.createUser$.pipe(
    switchMap((credentials) =>
      this.authService.createAccount(credentials).pipe(
        catchError((error) => {
          this.error$.next(error);
          return EMPTY;
        }),
      ),
    ),
  );

  constructor() {
    // reducers
    connect(this.state)
      .with(this.createUser$, () => ({ status: 'creating' }))
      .with(this.userCreated$, () => ({ status: 'success' }))
      .with(this.error$, () => ({ status: 'error' }));
  }
}
