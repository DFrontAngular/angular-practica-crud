import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { DirectivaDirective } from '../directiva.directive';
import { Car } from '../model/Car';
import { CarsService } from '../services/cars.service';

@Component({
  selector: 'app-table',
  imports: [DirectivaDirective, AsyncPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  cars: Car[] = [
    { id: '1', brand: 'Toyota', model: 'Corolla', total: 3 },
    { id: '2', brand: 'Honda', model: 'Civic', total: 2 },
    { id: '3', brand: 'Ford', model: 'Focus', total: 5 },
  ];

  private carsService = inject(CarsService);

  cars$ = this.carsService.getCars();
  activeMenuId = signal<string | null>(null);

  deleteCar(id: string): void {
    this.carsService.deleteCar(id).subscribe(() => {
      this.cars$ = this.carsService.getCars();
    });
  }

  toggleMenu(id: string): void {
    this.activeMenuId.set(this.activeMenuId() === id ? null : id);
  }
}
