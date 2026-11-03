import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelinesStore } from './pipelines.store';
import { TableFilterEvent, TableModule, TablePageEvent } from '@openng/optimus-ui/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '@openng/optimus-ui/button';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { TableConstants } from '@shared/contants/table.constants';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { FormsModule } from '@angular/forms';
import { StateDto } from '@api/models/pipeline/state-dto';
import { AuthRole } from '@shared/auth/auth-roles';
import { AuthorizationPipe } from '@shared/auth/authorization.pipe';
import { TableSkeleton } from '@shared/table/table-skeleton/table-skeleton';
import { NgTemplateOutlet } from '@angular/common';
import { PipelineService } from './pipeline.service';

@Component({
  selector: 'app-pipelines',
  imports: [
    TableModule,
    RouterLink,
    TranslocoPipe,
    Button,
    LocalisedPipe,
    Tooltip,
    AuditPanel,
    MultiSelect,
    FormsModule,
    AuthorizationPipe,
    TableSkeleton,
    NgTemplateOutlet,
  ],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipelines {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;

  protected readonly pipelinesStore = inject(PipelinesStore);
  private readonly pipelineService = inject(PipelineService);

  typeOptions = this.pipelineService.typeOptions;
  stateOptions = Object.values(StateDto);

  protected onFilter(event: TableFilterEvent) {
    this.pipelinesStore.changeFilter(event.filters as PipelineFilterDto);
  }

  protected onSort(event: object) {
    this.pipelinesStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.pipelinesStore.changePage(event);
  }
}
