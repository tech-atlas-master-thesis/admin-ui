import cron from 'cron-validate';
import { FieldValidator } from '@angular/forms/signals';

export const scheduleCronValidator: FieldValidator<string> = (control) => {
  return cron(control.value()).isValid() ? null : { kind: 'cronIsNotValid' };
};
