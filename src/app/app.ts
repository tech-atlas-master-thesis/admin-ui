import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBar } from './menu/menu-bar.component';
import { Breadcrumbs } from './breadcrumbs/breadcrumbs';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBar, Breadcrumbs],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly translocoService = inject(TranslocoService);
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.initialize();

    this.translocoService
      .selectTranslation(this.translocoService.getActiveLang())
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
}
