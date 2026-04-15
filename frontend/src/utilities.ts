import { ValidatorFn, Validators } from "@angular/forms";

export function regex (regex: RegExp): ValidatorFn {
    return Validators.pattern(regex);
}