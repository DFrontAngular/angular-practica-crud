import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AboutComponent } from "../about/about.component";
import { TableComponent } from "../table/table.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, AboutComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
