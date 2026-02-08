import { inject, Injectable } from '@angular/core';
import { HashMap, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly translocoService = inject(TranslocoService);

  currentLanguage = toSignal(
    this.translocoService.events$.pipe(
      tap(console.log),
      filter((event) => event.type === 'translationLoadSuccess'),
      switchMap(() =>
        this.translocoService.langChanges$.pipe(filter((lang) => !!this.translocoService.getTranslation().get(lang))),
      ),
      tap(console.log),
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
