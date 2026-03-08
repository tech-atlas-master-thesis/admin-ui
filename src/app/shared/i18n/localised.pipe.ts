import { Pipe, PipeTransform } from '@angular/core';
import { LocalisedString } from '@api/models/localisedString';

@Pipe({
  name: 'localised',
})
export class LocalisedPipe implements PipeTransform {
  transform(value: LocalisedString | undefined, language: string | undefined, fallback?: string): string {
    if (!value) {
      return fallback ?? '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (!language) {
      return fallback ?? '';
    }
    return value[language] ?? fallback ?? '';
  }
}
