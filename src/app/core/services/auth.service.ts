import { computed, inject, Injectable, signal } from '@angular/core';
import { Credentials } from '@app/core/models/credentials.model';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { connect } from 'ngxtension/connect';
import { authState } from 'rxfire/auth';
import { defer, from } from 'rxjs';
import { AUTH } from '../tokens/auth.token';

export type AuthUser = User | null | undefined;

interface AuthState {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(AUTH);

  // sources
  private readonly user$ = authState(this.auth);

  // state
  private readonly state = signal<AuthState>({
    user: undefined,
  });

  // selectors
  user = computed(() => this.state().user);

  constructor() {
    // reducers
    connect(this.state)
      .with(this.user$, (prev, user) => ({ user }));
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password,
        ),
      ),
    );
  }

  logout() {
    void signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password,
        ),
      ),
    );
  }

  async getToken() {
    return await this.auth.currentUser?.getIdToken();
  }
}
