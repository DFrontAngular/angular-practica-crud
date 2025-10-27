import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-coche',
  imports: [],
  templateUrl: './detalle-coche.component.html',
  styleUrl: './detalle-coche.component.css'
})

export class DetalleCocheComponent {

  id!: number;

    constructor(private route: ActivatedRoute){
      this.id = +this.route.snapshot.paramMap.get('id')!; //snapshot: accede a una instantánea de la ruta actual, paramMap: es un mapa que contiene los parámetros definidos en la URL)
    }
}
