import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import { Breadcrumbs } from './breadcrumbs/breadcrumbs';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Breadcrumbs],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    this.translocoService
      .selectTranslation(this.translocoService.getActiveLang())
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
}
