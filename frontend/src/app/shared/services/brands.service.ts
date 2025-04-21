import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly http = inject(HttpClient);
  private apiUrl: string = `${environment.apiUrl}/brands`;

  constructor() {}

  getBrands(): Observable<any> {
    return this.http.get(this.apiUrl, { responseType: 'json' });
  }

  getModelByBrand(brandId: string): Observable<any> {
    const url = `${this.apiUrl}/${brandId}/models`;
    return this.http.get(url);
  }
}
