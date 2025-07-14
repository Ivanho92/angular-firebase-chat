import { Component, effect, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { MessageService } from '@app/core/services/message.service';
import { MessageInputComponent } from '@app/home/components/message-input.component';
import { MessageListComponent } from '@app/home/components/message-list.component';

@Component({
  selector: 'app-home',
  imports: [
    MessageListComponent,
    MessageInputComponent,
    MatToolbar,
    MatIcon,
    MatIconButton,
  ],
  template: `
    <div class="container">
      <mat-toolbar color="primary">
        <span class="spacer"></span>
        <button mat-icon-button (click)="authService.logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <app-message-list
        [messages]="messageService.messages()"
        [activeUser]="authService.user()"
      />
      <app-message-input (onNewMessage)="messageService.add$.next($event)" />
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    mat-toolbar {
      box-shadow: 0px -7px 11px 0px var(--accent-color);
    }

    app-message-list {
      height: 100%;
      width: 100%;
    }

    app-message-input {
      position: fixed;
      bottom: 0;
    }
  `,
})
export default class HomeComponent {
  protected readonly messageService = inject(MessageService);
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.authService.user();
      if (!user) {
        void this.router.navigate(['auth', 'login']);
      }
    });
  }
}
