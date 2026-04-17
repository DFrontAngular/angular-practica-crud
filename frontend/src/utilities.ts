import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export function regex (regex: RegExp): ValidatorFn {
    return Validators.pattern(regex);
}

export function isInvalid (control: FormControl): boolean {
    return (control.invalid && (control.touched || control.dirty));
}

export const registrationDateValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const registrationDate = group.get('registrationDate')?.value as string;
  const manufactureYear = group.get('manufactureYear')?.value as number;

  if (!registrationDate || !manufactureYear) return null; 

  const registrationYear = parseInt(registrationDate.slice(0, 4));
  if (Number.isNaN(registrationYear)) return null

  return manufactureYear <= registrationYear
    ? null
    : { registrationDateBeforeManufatureYear: true };
};