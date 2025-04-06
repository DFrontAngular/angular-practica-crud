import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[customizedButton]',
})
export class CustomizedButtonDirective {
  private btn = inject(ElementRef);

  constructor() {
    this.defaultStyles();
  }

  private defaultStyles() {
    this.btn.nativeElement.classList.add(
      'bg-blue-500',
      'text-white',
      'font-semibold',
      'py-2',
      'px-4',
      'rounded-lg',
      'shadow-md',
      'hover:bg-blue-600',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-300',
      'transition-all',
      'duration-200',
      'cursor-pointer',
    );
  }
}
