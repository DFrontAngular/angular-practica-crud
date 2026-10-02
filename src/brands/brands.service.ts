import { Injectable, NotFoundException } from '@nestjs/common';
import { Brand, brandsDB, Model, modelsDB } from './data/brand.data';

@Injectable()
export class BrandsService {
  /**
   * Returns the full vehicle brand catalog.
   * @returns List of available vehicle brands.
   */
  getAllBrands(): Brand[] {
    return brandsDB;
  }

  /**
   * Returns all models associated with a specific vehicle brand.
   * @param brandId - Identifier of the selected brand.
   * @returns List of models linked to the requested brand.
   */
  getModelsByBrand(brandId: string): Model[] {
    const brandExists = brandsDB.some((brand) => brand.id === brandId);
    if (!brandExists) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }

    return modelsDB.filter((model) => model.brandId === brandId);
  }
}
