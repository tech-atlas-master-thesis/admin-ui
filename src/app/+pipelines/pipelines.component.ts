import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { PipelinesStore } from './pipelines.store';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { TableConstants } from '@shared/contants/table.constants';
import { Tooltip } from 'primeng/tooltip';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';

@Component({
  selector: 'app-pipelines',
  imports: [TableModule, RouterLink, TranslocoPipe, Button, LocalisedPipe, Tooltip, AuditPanel],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipelines {
  protected readonly TableConstants = TableConstants;

  protected readonly pipelinesStore = inject(PipelinesStore);

  constructor() {
    effect(() => {
      console.log(this.pipelinesStore.filterCleaned());
    });
  }

  protected onFilter(event: TableFilterEvent) {
    this.pipelinesStore.changeFilter(event.filters as PipelineFilterDto);
  }

  protected onSort(event: object) {
    this.pipelinesStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.pipelinesStore.changePage(event);
  }

  protected readonly now = new Date(Date.now());
}
