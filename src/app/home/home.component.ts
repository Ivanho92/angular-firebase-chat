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
    <div class="layout">
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
    .layout {
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100dvh;
    }

    mat-toolbar {
      box-shadow: 0px -7px 11px 0px var(--accent-color);
    }

    app-message-list {
      height: 100%;
      width: 100%;
    }
  `,
})
export default class HomeComponent {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly messageService = inject(MessageService);

  constructor() {
    effect(async () => {
      if (!this.authService.user()) {
        await this.router.navigate(['auth', 'login']);
      }
    });
  }
}
