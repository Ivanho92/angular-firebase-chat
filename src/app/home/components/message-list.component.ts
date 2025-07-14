import { Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { Message } from '@app/core/models/message.model';
import { AuthUser } from '@app/core/services/auth.service';

@Component({
  selector: 'app-message-list',
  template: `
    <ul #container>
      @for (message of messages(); track message.created) {
        <li
          [style.flex-direction]="
            message.author === activeUser()?.email ? 'row-reverse' : 'row'
          "
        >
          <div class="avatar animate-in-primary">
            <img
              src="https://api.dicebear.com/7.x/thumbs/svg?seed={{
                message.author.split('@')[0]
              }}"
            />
          </div>
          <div class="message animate-in-secondary">
            <small>{{ message.author }}</small>
            <p>
              {{ message.content }}
            </p>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      list-style-type: none;
      padding: 1rem;
      margin: 0;
    }

    li {
      display: flex;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 75px;
      margin: 0 1rem;
      height: auto;
      filter: drop-shadow(2px 3px 5px var(--accent-darker-color));
    }

    .message {
      width: 100%;
      background: var(--white);
      padding: 2rem;
      border-radius: 5px;
      filter: drop-shadow(2px 4px 3px var(--primary-darker-color));
    }
  `,
  host: {
    style: 'overflow-block: auto;',
    class: 'gradient-bg'
  }
})
export class MessageListComponent {
  messages = input.required<Message[]>();
  activeUser = input.required<AuthUser>();

  scrollContainer = viewChild.required<ElementRef>('container');

  constructor() {
    effect(() => {
      if (this.messages().length && this.scrollContainer()) {
        queueMicrotask(() => {
          const el = this.scrollContainer().nativeElement;
          el.scrollIntoView({ behavior: "smooth", block: "end" });
        })
      }
    });
  }
}
