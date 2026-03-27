import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsManufactureYearValid', async: false })
export class IsManufactureYearValidConstraint
  implements ValidatorConstraintInterface
{
  validate(manufactureYear: unknown, args: ValidationArguments): boolean {
    const { registrationDate } = args.object as { registrationDate?: string };

    if (
      manufactureYear === undefined ||
      manufactureYear === null ||
      registrationDate === undefined ||
      registrationDate === null
    ) {
      return true;
    }

    if (!Number.isInteger(manufactureYear)) {
      return false;
    }

    const registrationYear = new Date(registrationDate).getUTCFullYear();

    if (Number.isNaN(registrationYear)) {
      return true;
    }

    return (manufactureYear as number) <= registrationYear;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} cannot be later than the year of registrationDate`;
  }
}

export function IsManufactureYearValid(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsManufactureYearValidConstraint,
    });
  };
}
