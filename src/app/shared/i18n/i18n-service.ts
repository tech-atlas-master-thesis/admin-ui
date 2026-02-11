import { inject, Injectable } from '@angular/core';
import { HashMap, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly translocoService = inject(TranslocoService);

  currentLanguage = toSignal(
    this.translocoService.events$.pipe(
      filter((event) => event.type === 'translationLoadSuccess'),
      switchMap(() =>
        this.translocoService.langChanges$.pipe(filter((lang) => !!this.translocoService.getTranslation().get(lang))),
      ),
    ),
  );

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  instant(identifier: string, params?: HashMap, lang?: string): string {
    if (this.translocoService.getTranslation().size < 1) {
      return identifier;
    }
    return this.translocoService.translate<string>(identifier, params, lang);
  }
}
