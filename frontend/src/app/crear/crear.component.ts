import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear',
  imports: [],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent {
  marca = '';
  modelo = '';
  total = 0;

  constructor(private router: Router){}

  guardar() {
    alert('Coche se ha registrado correctamente')
    this.router.navigate(['/']);
  }
}
