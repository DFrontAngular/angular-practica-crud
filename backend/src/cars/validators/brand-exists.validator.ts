import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { brandsDB } from '../../brands/data/brand.data';

@ValidatorConstraint({ name: 'BrandExists', async: false })
export class BrandExistsConstraint implements ValidatorConstraintInterface {
  validate(brandId: string) {
    return brandsDB.some((b) => b.id === brandId);
  }

  defaultMessage() {
    return 'Brand ID does not exist in our database';
  }
}

export function IsBrandValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: BrandExistsConstraint,
    });
  };
}
