import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();
  @Output() oked = new EventEmitter<void>();

  close () {
    this.closed.emit();
  }

  ok () {
    this.oked.emit();
  }
}
