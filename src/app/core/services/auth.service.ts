import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Credentials } from '@app/core/models/credentials.model';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { AUTH } from '../tokens/auth.token';

export type AuthUser = User | null | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(AUTH);

  // sources
  private readonly user$ = authState(this.auth);

  // state
  user = toSignal(this.user$);

  login(credentials: Credentials) {
    return signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }

  logout() {
    void signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return createUserWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password,
    );
  }
}
