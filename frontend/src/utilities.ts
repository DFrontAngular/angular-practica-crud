import { FormControl, ValidatorFn, Validators } from "@angular/forms";

export function regex (regex: RegExp): ValidatorFn {
    return Validators.pattern(regex);
}

export function isInvalid (control: FormControl): boolean {
    return (control.invalid && (control.touched || control.dirty));
}