import { ChangeDetectorRef, effect, inject, Pipe, PipeTransform } from '@angular/core';
import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { I18nService } from '@shared/i18n/i18n-service';

@Pipe({
  name: 'localised',
})
export class LocalisedPipe implements PipeTransform {
  i18nService = inject(I18nService);
  cdr = inject(ChangeDetectorRef);

  constructor() {
    effect(() => {
      this.i18nService.currentLanguage();
      this.cdr.markForCheck();
    });
  }

  transform(value: LocalisedStringDto | undefined, fallback?: string): string {
    if (!value) {
      return fallback ?? '';
    }
    if (typeof value === 'string') {
      return value;
    }
    const language = this.i18nService.currentLanguage();
    if (!language) {
      return fallback ?? '';
    }
    return value[language] ?? fallback ?? '';
  }
}
