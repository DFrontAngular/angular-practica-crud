import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from "../../shared/table/table.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
