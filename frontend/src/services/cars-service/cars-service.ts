import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseDto } from '../../model/DTO/paginated-response-dto';
import { CarDetailDto } from '../../model/DTO/car-detail-dto';
import { CreateCarDto } from '../../model/DTO/create-car-dto';
import { CarBrandDto } from '../../model/DTO/car-brand-dto';
import { Observable } from 'rxjs';
import { CarModelDto } from '../../model/DTO/car-model-dto';


@Injectable({
  providedIn: 'root',
})
export class CarsService {
  baseUrl: string = '/api';
  timeout = 3000;

  constructor (private http: HttpClient) {}

  public getCarList(page: number): Observable<PaginatedResponseDto> {
    return this.http.get<PaginatedResponseDto>(
      `${this.baseUrl}/cars`,
      { 
        params: {
          page: page
        },
        timeout: this.timeout 
      }
    )
  }

  public getCarDetails(carId: string): Observable<CarDetailDto> {
    return this.http.get<CarDetailDto>(
      `${this.baseUrl}/cars/${carId}`,
      {
        timeout: this.timeout
      }
    )
  }

  public createCar(car: CreateCarDto): Observable<CarDetailDto> {
    return this.http.post<CarDetailDto>(
      `${this.baseUrl}/cars`, 
      car,
      {
        timeout: this.timeout
      }
    )
  }

  public editCar(carId: number, car: CreateCarDto): Observable<CarDetailDto> {
    return this.http.put<CarDetailDto>(
      `${this.baseUrl}/cars/${carId}`,
      car,
      {
        timeout: 3000
      }
    )
  }

  public getBrands(): Observable<CarBrandDto[]> {
    return this.http.get<CarBrandDto[]>(
      `${this.baseUrl}/brands`,
      {
        timeout: 3000
      }
    )
  }

  public getModelsByBrand(brandId: string): Observable<CarModelDto[]> {
    return this.http.get<CarModelDto[]>(
      `${this.baseUrl}/brands/${brandId}/models`,
      {
        timeout: 3000
      }
    )
  }
}
