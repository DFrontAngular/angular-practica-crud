import { Component, OnInit, Signal, WritableSignal, computed, signal } from '@angular/core';
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

  pages: Signal<number[]> = computed(()=>{
    var totalPages = this.paginatedResponse()?.meta.totalPages ?? 0;
    return Array.from({length: totalPages}, (_, i)=>i+1);
  })
  hasNextPage = computed(()=>this.paginatedResponse()?.meta.hasNextPage ?? false);
  hasPreviousPage = computed(()=>this.paginatedResponse()?.meta.hasPreviousPage ?? false);
  currentPage = computed(()=>this.paginatedResponse()?.meta.currentPage);

  constructor (private carsService: CarsService) {}

  ngOnInit(): void {
    this.getCars(1);
  }

  getCars(page: number){
    this.loading.set(true);
    
    this.carsService.getCars(page).subscribe({

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

  refreshCars() {
    this.getCars(this.currentPage() ?? 1);
  }

  navigateToPage(page: number){
    this.getCars(page);
  }

  goToPrevious(){
    if (this.currentPage() && this.hasPreviousPage()) {
      this.navigateToPage(this.currentPage()! - 1);
    }
  }

  goToNext(){
    if (this.currentPage() && this.hasNextPage()) {
      this.navigateToPage(this.currentPage()! + 1);
    }
  }
}
