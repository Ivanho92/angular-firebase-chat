import { computed, inject, Injectable, signal } from '@angular/core';
import { Credentials } from '@app/core/models/credentials.model';
import { AuthService } from '@app/core/services/auth.service';
import { connect } from 'ngxtension/connect';
import { EMPTY, Subject, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(AuthService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        }),
      ),
    ),
  );

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    // reducers
    connect(this.state)
      .with(this.userAuthenticated$, () => ({ status: 'success' }))
      .with(this.login$, () => ({ status: 'authenticating' }))
      .with(this.error$, () => ({ status: 'error' }));
  }
}
