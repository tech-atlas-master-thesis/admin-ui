import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { AuthorizationPipe } from '@shared/auth/authorization.pipe';
import { Button } from '@openng/optimus-ui/button';
import { MultiSelect } from '@openng/optimus-ui/multiselect';
import { NgTemplateOutlet } from '@angular/common';
import { TableFilterEvent, TableModule, TablePageEvent } from '@openng/optimus-ui/table';
import { TableSkeleton } from '@shared/table/table-skeleton/table-skeleton';
import { TranslocoPipe } from '@jsverse/transloco';
import { PipelineService } from '../+pipelines/pipeline.service';
import { StateDto } from '@api/models/pipeline/state-dto';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { TableConstants } from '@shared/contants/table.constants';
import { AuthRole } from '@shared/auth/auth-roles';
import { SchedulesStore } from './schedules.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tooltip } from '@openng/optimus-ui/tooltip';

@Component({
  selector: 'app-schedules',
  imports: [
    AuditPanel,
    AuthorizationPipe,
    Button,
    MultiSelect,
    NgTemplateOutlet,
    TableModule,
    TableSkeleton,
    TranslocoPipe,
    FormsModule,
    RouterLink,
    Tooltip,
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesComponent {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;

  protected readonly schedulesStore = inject(SchedulesStore);
  private readonly pipelineService = inject(PipelineService);
  private readonly destroyRef = inject(DestroyRef);

  typeOptions = this.pipelineService.typeOptions;
  stateOptions = Object.values(StateDto);

  protected onFilter(event: TableFilterEvent) {
    this.schedulesStore.changeFilter(event.filters as PipelineFilterDto);
  }

  protected onSort(event: object) {
    this.schedulesStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.schedulesStore.changePage(event);
  }

  protected onScheduleDelete(scheduleId: string) {
    this.schedulesStore.deleteSchedule$(scheduleId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected onScheduleTrigger(scheduleId: string) {
    this.schedulesStore.triggerSchedule$(scheduleId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
