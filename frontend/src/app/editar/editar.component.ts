import { routes } from './../app.routes';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-editar',
  imports: [],
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent {
  id!: number;
  marca = '';
  modelo = '';
  total = 0;


  constructor(private route: ActivatedRoute, private Router: Router) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    // Aquí podrías cargar los datos reales del coche
    }


  guardar() {
    alert(`Coche con ID ${this.id} actualizado`);
    this.Router.navigate(['/']);
  }

}
