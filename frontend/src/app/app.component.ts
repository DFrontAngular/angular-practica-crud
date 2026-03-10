import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DirectivaDirective } from './directiva.directive';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DirectivaDirective, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
