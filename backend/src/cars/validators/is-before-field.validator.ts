import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBeforeField', async: false })
export class IsBeforeFieldConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value || !relatedValue) return true;

    // Numerical year vs date string year
    const yearVal = typeof value === 'number' ? value : new Date(value).getFullYear();
    const otherYearVal = typeof relatedValue === 'number' ? relatedValue : new Date(relatedValue).getFullYear();

    return yearVal <= otherYearVal;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be before or equal to ${relatedPropertyName}`;
  }
}

export function IsBeforeField(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeFieldConstraint,
    });
  };
}
