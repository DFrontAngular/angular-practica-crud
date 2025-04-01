import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTableComponentComponent } from './crud-table-component.component';

describe('CrudTableComponentComponent', () => {
  let component: CrudTableComponentComponent;
  let fixture: ComponentFixture<CrudTableComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudTableComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudTableComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
