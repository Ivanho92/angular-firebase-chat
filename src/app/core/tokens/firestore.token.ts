import { InjectionToken } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';
import { environment } from '@env/environment';

const app = initializeApp(environment.firebase);

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore: Firestore;
    if (environment.useEmulators) {
      firestore = initializeFirestore(app, {});
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    } else {
      firestore = getFirestore();
    }
    return firestore;
  },
});
