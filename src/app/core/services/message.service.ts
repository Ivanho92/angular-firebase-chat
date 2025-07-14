import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Message, NewMessage } from '@app/core/models/message.model';
import { AuthService } from '@app/core/services/auth.service';
import { FIRESTORE } from '@app/core/tokens/firestore.token';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
import {
  catchError,
  defer,
  filter,
  ignoreElements,
  Observable,
  of,
  retry,
  Subject,
} from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';

interface MessageState {
  messages: Message[];
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly firestore = inject(FIRESTORE);
  private readonly authService = inject(AuthService);

  // state
  private readonly state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  // sources
  add$ = new Subject<NewMessage>();
  authUser$ = toObservable(this.authService.user);
  messages$ = this.getMessages().pipe(
    retry({ delay: () => this.authUser$.pipe(filter((user) => !!user)) }),
  );

  constructor() {
    // reducers
    connect(this.state)
      .with(this.messages$, (_, messages) => ({ messages }))
      .with(
        this.add$.pipe(
          exhaustMap((message) => this.addMessage(message)),
          ignoreElements(),
          catchError((error) => of({ error })),
        ),
      );
  }

  private getMessages(): Observable<Message[]> {
    const messagesCollection = query(
      collection(this.firestore, 'messages'),
      orderBy('created', 'desc'),
      limit(50),
    );

    return collectionData(messagesCollection, { idField: 'id' }).pipe(
      map((messages) => [...messages].reverse()),
    ) as Observable<Message[]>;
  }

  private addMessage(message: string) {
    const user = this.authService.user();

    if (!user) throw new Error('No user!');

    const newMessage: Message = {
      author: user.email!,
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
