import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCocheComponent } from './detalle-coche.component';

describe('DetalleCocheComponent', () => {
  let component: DetalleCocheComponent;
  let fixture: ComponentFixture<DetalleCocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCocheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
