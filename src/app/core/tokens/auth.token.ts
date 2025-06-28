import { InjectionToken } from '@angular/core';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { environment } from '@env/environment';

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    if (environment.useEmulators) {
      connectAuthEmulator(auth, 'http://localhost:9099', {
        disableWarnings: true,
      });
    }
    return auth;
  },
});
