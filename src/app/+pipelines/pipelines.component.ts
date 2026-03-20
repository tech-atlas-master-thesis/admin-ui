import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelinesStore } from './pipelines.store';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';
import { TableConstants } from '@shared/contants/table.constants';

@Component({
  selector: 'app-pipelines',
  imports: [TableModule, RouterLink, TranslocoPipe, Button, LocalisedPipe],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipelines {
  protected readonly TableConstants = TableConstants;

  protected readonly pipelinesStore = inject(PipelinesStore);
  private readonly i18nService = inject(I18nService);

  protected onFilter(event: TableFilterEvent) {
    this.pipelinesStore.changeFilter(event.filters);
  }

  protected onSort(event: object) {
    this.pipelinesStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.pipelinesStore.changePage(event);
  }
}
