import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Car } from '../model/Car';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cars`;

  getCars() {
    return this.http.get<Car[]>(this.apiUrl);
  }
  getCarById(id: string) {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  createCar(car: Car) {
    return this.http.post<Car>(this.apiUrl, car);
  }

  updateCar(id: string, car: Car) {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
