import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelinesStore } from './pipelines.store';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-pipelines',
  imports: [TableModule, RouterLink, TranslocoPipe, Button, LocalisedPipe],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipelines {
  protected readonly pipelinesStore = inject(PipelinesStore);
  private readonly i18nService = inject(I18nService);

  currentLanguage = this.i18nService.currentLanguage;
}
