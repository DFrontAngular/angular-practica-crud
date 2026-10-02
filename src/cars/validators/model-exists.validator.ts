import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { modelsDB } from '../../brands/data/brand.data';

@ValidatorConstraint({ name: 'ModelExists', async: false })
export class ModelExistsConstraint implements ValidatorConstraintInterface {
  validate(modelId: string, args: ValidationArguments) {
    const brandId = (args.object as any).brandId;
    if (!brandId) return false;

    // Check if model exists and matches the brandId
    return modelsDB.some((m) => m.id === modelId && m.brandId === brandId);
  }

  defaultMessage(args: ValidationArguments) {
    return `Model ID does not exist or does not match the selected brand ID (${(args.object as any).brandId})`;
  }
}

export function IsModelValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ModelExistsConstraint,
    });
  };
}
