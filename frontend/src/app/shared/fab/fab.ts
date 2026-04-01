import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fab',
  imports: [],
  templateUrl: './fab.html',
  styleUrl: './fab.css',
})
export class Fab {
  @Input() icon: string = '+';
  @Input() ariaLabel: string = 'Floating Action Button'
  @Output() clickEvent = new EventEmitter<void>();

  onClick(){
    this.clickEvent.emit();
  }
}
