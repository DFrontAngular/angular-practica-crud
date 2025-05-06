import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component } from '@angular/core';
import { CarButtonDirective } from '../../shared/directives/car-button.directive';

@Component({
  selector: 'app-table',
  imports: [CarButtonDirective, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {}
