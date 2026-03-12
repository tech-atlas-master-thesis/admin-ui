import { Pipe, PipeTransform } from '@angular/core';
import { LocalisedStringDto } from '@api/models/localised-string-dto';

@Pipe({
  name: 'localised',
})
export class LocalisedPipe implements PipeTransform {
  transform(value: LocalisedStringDto | undefined, language: string | undefined, fallback?: string): string {
    console.log(value, language);
    if (!value) {
      return fallback ?? '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (!language) {
      return fallback ?? '';
    }
    console.log(value, language);
    return value[language] ?? fallback ?? '';
  }
}
