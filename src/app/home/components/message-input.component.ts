import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  selector: 'app-message-input',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input
        type="text"
        placeholder="type a message..."
        [formControl]="form.controls.message"
      />
      <button mat-button>
        <mat-icon>send</mat-icon>
      </button>
    </form>
  `,
  styles: `
    :host {
      width: 100%;
      position: relative;
    }

    input {
      width: 100%;
      background: var(--white);
      border: 1px solid var(--black);
      font-size: 1.2em;
      padding: 1rem;
    }

    button {
      height: 100% !important;
      position: absolute;
      right: 0;
      bottom: 0;

      mat-icon {
        margin-right: 0;
      }
    }
  `,
})
export class MessageInputComponent {
  fb = inject(FormBuilder);

  onNewMessage = output<string>();

  protected readonly form = this.fb.nonNullable.group({
    message: '',
  });

  protected onSubmit() {
    this.onNewMessage.emit(this.form.getRawValue().message);
    this.form.controls.message.reset();
  }
}
