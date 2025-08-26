import { inject, Injectable, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Credentials } from '@app/core/models/credentials.model';
import { AuthService } from '@app/core/services/auth.service';
import { Subject } from 'rxjs';

@Injectable()
export class LoginService {
  private readonly authService = inject(AuthService);

  // sources
  login$ = new Subject<Credentials>();
  login = toSignal(this.login$);

  userAuthenticated = resource({
    params: this.login,
    loader: ({ params: credentials }) => this.authService.login(credentials),
  });
}
