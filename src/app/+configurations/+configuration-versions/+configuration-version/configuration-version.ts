import { ChangeDetectionStrategy, Component, DestroyRef, inject, linkedSignal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { disabled, form, FormField, readonly } from '@angular/forms/signals';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ConfigurationStore } from '../configuration.store';
import { ConfigurationVersionStore } from './configuration-version.store';
import { TableConstants } from '@shared/contants/table.constants';
import { AuthRole } from '@shared/auth/auth-roles';
import { Button } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { JsonEditor } from 'ang-jsoneditor';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { ConfigurationTechnologies } from './configuration-technologies/configuration-technologies';

@Component({
  selector: 'app-configuration-version',
  imports: [
    TranslocoPipe,
    FormField,
    InputText,
    Textarea,
    Button,
    NgxJsonViewerModule,
    JsonEditor,
    FormsModule,
    InputNumber,
    ConfigurationTechnologies,
  ],
  templateUrl: './configuration-version.html',
  styleUrl: './configuration-version.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationVersion {
  protected readonly TableConstants = TableConstants;
  protected readonly AuthRole = AuthRole;

  protected readonly configurationStore = inject(ConfigurationStore);
  protected readonly configurationVersionStore = inject(ConfigurationVersionStore);
  private readonly destroyRef = inject(DestroyRef);

  versionModel = linkedSignal(() => {
    const { version, name, state, description, configuration } = this.configurationVersionStore.version() ?? {};
    return {
      version: version ?? 0,
      name: name ?? '',
      state: state ?? ConfigurationStateDto.DRAFT,
      description: description ?? '',
      configuration: configuration ?? {},
      edit: false,
    };
  });
  versionForm = form(this.versionModel, (form) => {
    readonly(form, (c) => !c.value().edit);
    disabled(form.version);
    disabled(form.state);
  });

  protected onCancel() {
    const { version, name, state, description, configuration } = this.configurationVersionStore.version() ?? {};
    this.versionModel.set({
      version: version ?? 0,
      name: name ?? '',
      state: state ?? ConfigurationStateDto.DRAFT,
      description: description ?? '',
      configuration: configuration ?? {},
      edit: false,
    });
  }

  protected onSave() {
    this.versionForm.edit().value.set(false);
    this.configurationVersionStore
      .updateVersion$(this.versionForm().value())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
