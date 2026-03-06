import { Directive, input, computed } from '@angular/core';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: '[appButton]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled()',
  },
})
export class DirectivaDirective {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  hostClasses = computed(() => {
    const classes = [
      'app-btn',
      `app-btn--${this.variant()}`,
      `app-btn--${this.size()}`,
    ];
    if (this.loading()) classes.push('app-btn--loading');
    if (this.disabled()) classes.push('app-btn--disabled');
    return classes.join(' ');
  });
}
