import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CarsService } from '../cars.service';

@ValidatorConstraint({ name: 'UniqueLicensePlate', async: false })
@Injectable()
export class UniqueLicensePlateConstraint implements ValidatorConstraintInterface {
  constructor(private readonly carsService: CarsService) {}

  validate(licensePlate: string, args: ValidationArguments) {
    if (!licensePlate) return true;
    
    // We need the car ID for updates (to exclude itself)
    // In a real app, this might come from the request params.
    // For this simple CRUD, we'll assume it's an update if the ID is present in the object (though not standard for all apps)
    const entityId = (args.object as any).id || (args.object as any).carId;
    
    return !this.carsService.isLicensePlateTaken(licensePlate, entityId);
  }

  defaultMessage(args: ValidationArguments) {
    return `The license plate ${args.value} is already registered to another car.`;
  }
}

export function IsUniqueLicensePlate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueLicensePlateConstraint,
    });
  };
}
