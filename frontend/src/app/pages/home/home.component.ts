import { Component } from '@angular/core';
import { CustomizedButtonDirective } from '../../shared/directives/customized-button.directive';
import { TableComponent } from '../../shared/components/table/table.component';

@Component({
  selector: 'app-home',
  imports: [TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
