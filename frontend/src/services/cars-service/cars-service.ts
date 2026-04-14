import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseDto } from '../../model/DTO/paginated-response-dto';
import { CarDetailDto } from '../../model/DTO/car-detail-dto';
import { CreateCarDto } from '../../model/DTO/create-car-dto';


@Injectable({
  providedIn: 'root',
})
export class CarsService {
  baseUrl: string = '/api';

  constructor (private http: HttpClient) {}

  public getCarList(page: number){
    return this.http.get<PaginatedResponseDto>(
      `${this.baseUrl}/cars`,
      { 
        params: {
          page: page
        },
        timeout: 3000 
      }
    )
  }

  public getCarDetails(carId: string) {
    return this.http.get<CarDetailDto>(
      `${this.baseUrl}/cars/${carId}`,
      {
        timeout: 3000
      }
    )
  }

  public createCar(car: CreateCarDto) {
    return this.http.post(
      `${this.baseUrl}/cars`, 
      car,
      {
        timeout: 3000
      }
    )
  }

  public editCar(carId: number, car: CreateCarDto) {
    return this.http.put(
      `${this.baseUrl}/cars/${carId}`,
      car,
      {
        timeout: 3000
      }
    )
  }
}
