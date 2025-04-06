import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomizedButtonDirective } from './shared/directives/customized-button.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomizedButtonDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
