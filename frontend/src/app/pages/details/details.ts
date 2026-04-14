import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CarDetailDto } from '../../../model/DTO/car-dto';
import { CarsService } from '../../../services/cars-service/cars-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Dialog } from '../../shared/dialog/dialog';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, DatePipe, RouterLink, Dialog],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  carId: string|null = null;

  isDialogOpen: WritableSignal<boolean> = signal(false);

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<any> = signal(null);
  carDetails: WritableSignal<CarDetailDto|null> = signal(null);

  constructor (
    private carsService: CarsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('id');
    this.getCarDetails();
  }

  getCarDetails(): void {
    if (this.carId == null) 
      throw new Error("Car ID should not be null");
    
    this.loading.set(true);

    this.carsService.getCarDetails(this.carId).subscribe({
      next: (carDetails) => {
        this.carDetails.set(carDetails);
      },

      error: (error) => {
        this.loading.set(false);
        this.error.set(error);
        this.carDetails.set(null);

        console.log(error)
      },

      complete: () => {
        this.loading.set(false);
        this.error.set(null);
      }
    });
  }

  openDialog(){
    this.isDialogOpen.set(true);
  }

  closeDialog(){
    this.isDialogOpen.set(false);
  }

  onDialogConfirmation(){
    alert(`DELETE CAR ${this.carDetails()?.brand.name ?? 'ERROR'} ${this.carDetails()?.model.name ?? 'ERROR'}`);
    this.isDialogOpen.set(false);
  }
}