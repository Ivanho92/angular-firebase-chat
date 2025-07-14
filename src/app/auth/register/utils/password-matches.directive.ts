import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchesValidator: ValidatorFn = (
  formGroup: AbstractControl,
): ValidationErrors | null => {
  const control = formGroup.get('password')!;
  const confirmControl = formGroup.get('confirmPassword')!;

  if (control.value === confirmControl.value) {
    removeError(confirmControl, 'passwordMismatch');
    return null;
  } else {
    confirmControl.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
};

const removeError = (control: AbstractControl, error: string) => {
  const errors = control.errors;
  if (!errors) return;
  delete errors[error];
  control.setErrors(Object.keys(errors).length ? errors : null);
};
