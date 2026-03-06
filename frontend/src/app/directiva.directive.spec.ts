import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DirectivaDirective,
  ButtonVariant,
  ButtonSize,
} from './directiva.directive';

@Component({
  standalone: true,
  imports: [DirectivaDirective],
  template: `
    <button
      appButton
      [variant]="variant"
      [size]="size"
      [loading]="loading"
      [disabled]="disabled"
    >
      Test
    </button>
  `,
})
class TestHostComponent {
  variant: ButtonVariant = 'primary';
  size: ButtonSize = 'md';
  loading = false;
  disabled = false;
}
describe('DirectivaDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  const getButton = () => fixture.debugElement.query(By.css('button'));

  it('should apply base class app-btn', () => {
    expect(getButton().nativeElement.className).toContain('app-btn');
  });

  it('should apply primary variant class by default', () => {
    expect(getButton().nativeElement.className).toContain('app-btn--primary');
  });

  it('should apply medium size class by default', () => {
    expect(getButton().nativeElement.className).toContain('app-btn--md');
  });

  it('should apply danger class when variant is danger', () => {
    host.variant = 'danger';
    fixture.detectChanges();
    expect(getButton().nativeElement.className).toContain('app-btn--danger');
  });

  it('should apply disabled class when disabled is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    expect(getButton().nativeElement.className).toContain('app-btn--disabled');
  });
});
