import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private readonly http = inject(HttpClient);

  private apiUrl: string = `${environment.apiUrl}/cars`;

  constructor() {}

  getCars(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' });
  }

  getCarById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get(url);
  }

  createCar(carData: any): Observable<any> {
    return this.http.post(this.apiUrl, carData);
  }

  updateCar(id: string, carData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, carData);
  }

  deleteCar(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
