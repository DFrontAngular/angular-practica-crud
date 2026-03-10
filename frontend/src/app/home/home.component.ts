import { Component } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { BreadcrumbItem } from '../model/Breadcrumb';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-home',
  imports: [TableComponent, BreadcrumbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  breadcrumbs: BreadcrumbItem[] = [{ label: 'Inicio', url: '/' }];
}
