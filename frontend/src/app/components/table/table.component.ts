import { Component } from '@angular/core'
import { MatTableModule } from '@angular/material/table'

import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  imports: [MatTableModule, MatIconModule, MatDividerModule, MatButtonModule],
})
export class TableComponent {
  displayedColumns: string[] = ['id', 'brand', 'model', 'total', 'actions']
  dataSource = ELEMENT_DATA
}
export interface PeriodicElement {
  id: number
  brand: string
  model: string
  total: string
  actions: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    brand: 'Prueba',
    model: 'Prueba',
    total: 'Prueba',
    actions: 'botones',
  },
  {
    id: 2,
    brand: 'Prueba',
    model: 'Prueba',
    total: 'Prueba',
    actions: 'botones',
  },
]
