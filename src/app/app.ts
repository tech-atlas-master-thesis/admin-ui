import { ApplicationRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBar } from './menu/menu-bar.component';
import { Breadcrumbs } from './breadcrumbs/breadcrumbs';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@shared/auth/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ErrorService } from '@shared/error/error.service';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBar, Breadcrumbs, Toast],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly translocoService = inject(TranslocoService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly errorService = inject(ErrorService);
  private readonly applicationRef = inject(ApplicationRef);

  isAuthenticated = toSignal(this.authService.isAuthenticated$);

  constructor() {
    this.authService.initialize();
    this.initTransloco();
    this.initErrorMessages();
  }

  private initTransloco() {
    this.translocoService
      .selectTranslation(this.translocoService.getActiveLang())
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  private initErrorMessages() {
    this.errorService.httpErrors
      .pipe(
        tap((data) => console.log(data)),
        filter((errors) => errors.length !== 0),
        tap((errors) => {
          console.log('add messages', errors);
          this.messageService.addAll(errors);
          this.errorService.clearError();
          this.applicationRef.tick();
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
