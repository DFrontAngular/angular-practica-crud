import { Component, signal } from '@angular/core';
import { DirectivaDirective } from '../directiva.directive';
import { Car } from '../model/Car';

@Component({
  selector: 'app-table',
  imports: [DirectivaDirective],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  cars: Car[] = [
    { id: 1, brand: 'Toyota', model: 'Corolla', total: 3 },
    { id: 2, brand: 'Honda', model: 'Civic', total: 2 },
    { id: 3, brand: 'Ford', model: 'Focus', total: 5 },
  ];

  deleteCar(id: number): void {
    this.cars = this.cars.filter((car) => car.id !== id);
  }

  activeMenuId = signal<number | null>(null);

  toggleMenu(id: number): void {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }
}
