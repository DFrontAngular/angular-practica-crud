import { Component, inject, signal } from '@angular/core';
import { CustomizedButtonDirective } from '../../directives/customized-button.directive';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuGroup,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { CarsService } from '../../services/cars.service';
import { Car } from '../../interfaces/Car.interface';

@Component({
  selector: 'cars-table',
  imports: [CustomizedButtonDirective, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  cars = signal<Car[]>([]);
  private carService = inject(CarsService);

  ngOnInit(): void {
    localStorage.setItem('auth-token', 'mock-token');
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(
      (data) => {
        this.cars = signal(data);
        console.log(this.cars());
      },
      (error) => {
        console.error('Error fetching cars:', error);
      },
    );
  }
}
