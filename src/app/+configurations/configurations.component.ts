import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { ConfigurationsStore } from './configurations.store';
import { TableConstants } from '@shared/contants/table.constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AuthRole } from '@shared/auth/auth-roles';
import { AuthorizationPipe } from '@shared/auth/authorization.pipe';
import { Tooltip } from 'primeng/tooltip';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { I18nService } from '@shared/i18n/i18n-service';
import { SelectItem } from 'primeng/api';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';

@Component({
  selector: 'app-configuration',
  imports: [
    TableModule,
    TranslocoPipe,
    MultiSelect,
    FormsModule,
    Button,
    RouterLink,
    AuthorizationPipe,
    Tooltip,
    AuditPanel,
  ],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Configurations {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;
  protected readonly configurationsStore = inject(ConfigurationsStore);
  private readonly i18nService = inject(I18nService);

  typeOptions = computed<SelectItem<string>[]>(
    () =>
      this.configurationsStore
        .configurationTypes()
        ?.map((type) => ({ value: type.type, label: this.i18nService.localised(type.name, type.type) })) ?? [],
  );

  protected onFilter(event: TableFilterEvent) {
    this.configurationsStore.changeFilter(event.filters as PipelineFilterDto);
  }

  protected onSort(event: object) {
    this.configurationsStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.configurationsStore.changePage(event);
  }
}
