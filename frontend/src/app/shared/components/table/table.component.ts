import { Component, inject } from '@angular/core';
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
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'cars-table',
  imports: [
    CustomizedButtonDirective,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    JsonPipe,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  cars: any[] = [];
  private carService = inject(CarsService);

  ngOnInit(): void {
    localStorage.setItem('auth-token', 'mock-token');
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(
      (data) => {
        this.cars = data;
      },
      (error) => {
        console.error('Error fetching cars:', error);
      },
    );
  }
}
