import { Module } from '@nestjs/common';
import { CarsModule } from '../cars/cars.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [CarsModule],
})
export class SeedModule {}
