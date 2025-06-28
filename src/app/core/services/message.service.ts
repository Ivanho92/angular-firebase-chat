import { computed, inject, Injectable, signal } from '@angular/core';
import { Message, NewMessage } from '@app/core/models/message.model';
import { FIRESTORE } from '@app/core/tokens/firestore.token';
import { addDoc, collection, limit, orderBy, query } from 'firebase/firestore';
import { connect } from 'ngxtension/connect';
import { collectionData } from 'rxfire/firestore';
import { catchError, defer, ignoreElements, Observable, of, Subject, } from 'rxjs';
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

  // state
  private readonly state = signal<MessageState>({
    messages: [],
    error: null,
  });

  // selectors
  messages = computed(() => this.state().messages);
  error = computed(() => this.state().error);

  // sources
  messages$ = this.getMessages();
  add$ = new Subject<NewMessage>();

  constructor() {
    // reducers
    connect(this.state)
      .with(this.messages$, (_state, messages) => ({ messages }))
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
    const newMessage: Message = {
      author: 'me@test.com',
      content: message,
      created: Date.now().toString(),
    };

    const messagesCollection = collection(this.firestore, 'messages');
    return defer(() => addDoc(messagesCollection, newMessage));
  }
}
