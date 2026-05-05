import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { TableConstants } from '@shared/contants/table.constants';
import { DataSetsStore } from './data-sets.store';
import { TranslocoPipe } from '@jsverse/transloco';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { RouterLink } from '@angular/router';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { PipelinesStore } from '../../+pipelines/pipelines.store';
import { SelectItem } from 'primeng/api';
import { I18nService } from '@shared/i18n/i18n-service';
import { AuthorizationPipe } from '@shared/auth/authorization.pipe';
import { AuthRole } from '@shared/auth/auth-roles';

@Component({
  selector: 'app-datasets',
  imports: [TableModule, TranslocoPipe, MultiSelect, FormsModule, Button, AuditPanel, RouterLink, AuthorizationPipe],
  templateUrl: './data-sets.component.html',
  styleUrl: './data-sets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSetsComponent {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;

  protected readonly dataSetsStore = inject(DataSetsStore);
  protected readonly pipelinesStore = inject(PipelinesStore);

  private readonly i18nService = inject(I18nService);

  typeOptions = computed<SelectItem<string>[]>(
    () =>
      this.pipelinesStore
        .pipelineTypes()
        ?.map((type) => ({ value: type.type, label: this.i18nService.localised(type.displayName, type.type) })) ?? [],
  );

  protected onFilter(event: TableFilterEvent) {
    this.dataSetsStore.changeFilter(event.filters as PipelineFilterDto);
  }

  protected onSort(event: object) {
    this.dataSetsStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.dataSetsStore.changePage(event);
  }
}
