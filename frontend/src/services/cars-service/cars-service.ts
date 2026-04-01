import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponseDto } from '../../model/DTO/paginated-response-dto';


@Injectable({
  providedIn: 'root',
})
export class CarsService {
  constructor (private http: HttpClient) {}

  public getCars(page: number){
    return this.http.get<PaginatedResponseDto>(
      '/api/cars',
      { 
        params: {
          page: page
        },
        timeout: 3000 
      }
    )
  }
}
