import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { PaginatedResponseDto } from '../../../model/DTO/paginated-response-dto';
import { CarsService } from '../../../services/cars-service/cars-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<any> = signal(null);
  paginatedResponse: WritableSignal<PaginatedResponseDto|null> = signal(null);

  constructor (private carsService: CarsService) {}

  ngOnInit(): void {
    this.refreshCars();
  }

  refreshCars() {
    this.loading.set(true);
    
    this.carsService.getCars().subscribe({

      "next": (paginatedResponse) => {
        this.paginatedResponse.set(paginatedResponse);
      },

      "error": (error) => {
        this.loading.set(false);
        this.error.set(error);
        this.paginatedResponse.set(null);
      },

      "complete": () => {
        this.loading.set(false);
        this.error.set(null);
      }

    });
  }

  
}
