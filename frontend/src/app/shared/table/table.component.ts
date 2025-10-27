import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import {  NgForOf } from '@angular/common'

@Component({
  selector: 'app-table',
  imports: [NgForOf, RouterLink],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  coches = [
    {id: 1, marca: 'Volkswagen', modelo: 'Polo', total: 1000  },
    {id: 2, marca: 'Seat', modelo: 'Ibiza', total: 800  },
    {id: 3, marca: 'Ferrari', modelo: 'GTO', total: 10000  },

  ];

  constructor(private router: Router){

  };

  eliminar(id: number) {
    const confirmar = confirm('¿Estás seguro de que quieres eliminar este coche?');

    if (confirmar){
      this.coches = this.coches.filter( coche => coche.id !== id)
    }

  }

}
