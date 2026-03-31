import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarsService } from '../services/cars-service/cars-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  constructor(carsService: CarsService){
    carsService.getCars().subscribe((it)=>{console.log(it)});
  }
}
