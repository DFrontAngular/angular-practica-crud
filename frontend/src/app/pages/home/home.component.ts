import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';

@Component({
  selector: 'app-home',
  imports: [CarButtonDirective, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
