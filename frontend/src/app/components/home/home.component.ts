import { Component } from '@angular/core'

import { TableComponent } from '../table/table.component'

@Component({
  selector: 'app-home',
  imports: [TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
