import { ValidatorFn } from '@angular/forms';

export const error = { configurationValidationError: 'errors.configurationValidationError' };

export const configurationValidator: ValidatorFn = (control) => {
  const value = control.value;
  if (!value || typeof value !== 'object' || !('configurationId' in value) || value.configurationId === undefined) {
    return error;
  }
  return null;
};
