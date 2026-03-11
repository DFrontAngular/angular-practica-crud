import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/brands`;

  getBrands() {
    return this.http.get<string[]>(this.apiUrl);
  }

  getModelsByBrand(brandId: string) {
    return this.http.get<string[]>(`${this.apiUrl}/${brandId}/models`);
  }
}
