import { Component, inject } from '@angular/core';
import { MessageService } from '@app/core/services/message.service';
import { MessageInputComponent } from '@app/home/components/message-input.component';
import { MessageListComponent } from '@app/home/components/message-list.component';

@Component({
  selector: 'app-home',
  imports: [MessageListComponent, MessageInputComponent],
  template: `
    <p>HomeComponent</p>
    <div class="container">
      <app-message-list [messages]="messageService.messages()" />
      <app-message-input (onNewMessage)="messageService.add$.next($event)" />
    </div>
  `,
  styles: ``,
})
export default class HomeComponent {
  protected readonly messageService = inject(MessageService);
}
