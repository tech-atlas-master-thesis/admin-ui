import { inject, Injectable } from '@angular/core';
import { HashMap, LangDefinition, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { LocalisedStringDto } from '@api/models/localised-string-dto';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly STORAGE_KEY = 'i18nService_language';

  private readonly translocoService = inject(TranslocoService);

  currentLanguage = toSignal(
    this.translocoService.events$.pipe(
      filter((event) => event.type === 'translationLoadSuccess'),
      switchMap(() =>
        this.translocoService.langChanges$.pipe(filter((lang) => !!this.translocoService.getTranslation().get(lang))),
      ),
    ),
  );

  availableLanguages = this.translocoService
    .getAvailableLangs()
    .map((lang) => (typeof lang === 'string' ? { id: lang, label: lang } : lang));

  constructor() {
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    if (savedLanguage) {
      this.translocoService.setActiveLang(savedLanguage);
    }
  }

  changeLanguage(lang: string | LangDefinition) {
    const language = typeof lang === 'string' ? lang : lang.id;
    localStorage.setItem(this.STORAGE_KEY, language);
    this.translocoService.setActiveLang(language);
  }

  instant(identifier: string, params?: HashMap, lang?: string): string {
    if (this.translocoService.getTranslation().size < 1) {
      return identifier;
    }
    return this.translocoService.translate<string>(identifier, params, lang);
  }

  localised(value: LocalisedStringDto | undefined, fallback?: string) {
    if (!value) {
      return fallback ?? '';
    }
    if (typeof value === 'string') {
      return value;
    }
    const language = this.currentLanguage();
    if (!language) {
      return fallback ?? '';
    }
    return value[language] ?? fallback ?? '';
  }
}
