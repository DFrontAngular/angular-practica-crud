import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponseDto } from '../../model/DTO/paginated-response-dto';
import { CarDetailDto } from '../../model/DTO/car-dto';


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
}
