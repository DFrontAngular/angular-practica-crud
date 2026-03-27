import { Injectable } from '@nestjs/common';
import { Brand, brandsDB, Model, modelsDB } from './data/brand.data';

@Injectable()
export class BrandsService {
  /**
   * Retrieves all car brands from the database.
   * @returns An array of all car brands.
   */
  getAllBrands(): Brand[] {
    return brandsDB;
  }

  /**
   * Retrieves all models for a specific brand, given the brand's ID.
   * @param brandId - The unique ID representing the car brand.
   * @returns An array of models for the given brand, or an empty array if no models are found.
   */
  getModelsByBrand(brandId: string): Model[] {
    return modelsDB.filter((model) => model.brandId === brandId);
  }
}
