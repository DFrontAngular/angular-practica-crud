import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appCarButton]',
})
export class CarButtonDirective {
  #element = inject(ElementRef);
  #renderer = inject(Renderer2);

  @HostListener('mouseenter') onMouseEnter() {
    this.#renderer.addClass(this.#element.nativeElement, 'car-button-hover');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.#renderer.removeClass(this.#element.nativeElement, 'car-button-hover');
  }

  constructor() {
    this.#renderer.addClass(this.#element.nativeElement, 'car-button');
  }
}
