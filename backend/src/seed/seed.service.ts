import { Injectable } from '@nestjs/common';
import { CarsService } from '../cars/cars.service';
import { CARS_SEED } from './data/cars.seed';

@Injectable()
export class SeedService {
  constructor(private readonly carsService: CarsService) {}

  populateDB() {
    this.carsService.fillSeedData(CARS_SEED);
    return { message: 'Catalog dataset loaded successfully' };
  }
}
