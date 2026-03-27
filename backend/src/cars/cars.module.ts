import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { UniqueLicensePlateConstraint } from './validators/unique-license-plate.validator';

@Module({
  controllers: [CarsController],
  providers: [CarsService, UniqueLicensePlateConstraint],
  exports: [CarsService],
})
export class CarsModule {}
