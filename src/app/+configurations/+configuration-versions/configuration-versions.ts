import { ChangeDetectionStrategy, Component, DestroyRef, inject, linkedSignal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfigurationStore } from './configuration.store';
import { ConfigurationVersionsStore } from './configuration-versions.store';
import { disabled, form, FormField, readonly, required } from '@angular/forms/signals';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TableFilterEvent, TableModule, TablePageEvent } from 'primeng/table';
import { ConfigurationVersionFilter } from '@api/models/configuration/configuration-version-filter';
import { AuditPanel } from '@shared/info-panel/audit-info-panel/audit-panel.component';
import { AuthorizationPipe } from '@shared/auth/authorization.pipe';
import { Button } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { TableConstants } from '@shared/contants/table.constants';
import { RouterLink } from '@angular/router';
import { Tooltip } from 'primeng/tooltip';
import { AuthRole } from '@shared/auth/auth-roles';
import { FormsModule } from '@angular/forms';
import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-configuration-versions',
  imports: [
    TranslocoPipe,
    InputText,
    FormField,
    Textarea,
    AuditPanel,
    AuthorizationPipe,
    Button,
    MultiSelect,
    TableModule,
    RouterLink,
    Tooltip,
    FormsModule,
  ],
  templateUrl: './configuration-versions.html',
  styleUrl: './configuration-versions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationVersions {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;
  protected readonly stateOptions = Object.values(ConfigurationStateDto);

  protected readonly configurationStore = inject(ConfigurationStore);
  protected readonly configurationVersionsStore = inject(ConfigurationVersionsStore);

  private readonly destroyRef = inject(DestroyRef);

  configurationModel = linkedSignal(() => {
    const { name, type, description } = this.configurationStore.configuration() ?? {};
    return { name: name ?? '', type: type ?? '', description: description ?? '', edit: false };
  });
  configurationForm = form(this.configurationModel, (form) => {
    readonly(form, (c) => !c.value().edit);
    required(form.name);
    disabled(form.type);
  });

  protected onFilter(event: TableFilterEvent) {
    this.configurationVersionsStore.changeFilter(event.filters as ConfigurationVersionFilter);
  }

  protected onSort(event: object) {
    this.configurationVersionsStore.changeSort(event);
  }

  protected onPage(event: TablePageEvent) {
    this.configurationVersionsStore.changePage(event);
  }

  protected onCancel() {
    const { name, type, description } = this.configurationStore.configuration() ?? {};
    this.configurationModel.set({
      name: name ?? '',
      type: type ?? '',
      description: description ?? '',
      edit: false,
    });
  }

  protected onSave() {
    this.configurationForm.edit().value.set(false);
    this.configurationStore
      .updateConfiguration$(this.configurationForm().value())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
