import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { TranslocoPipe } from '@jsverse/transloco';
import { SelectItem } from 'primeng/api';
import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';
import { form, FormField, required, schema } from '@angular/forms/signals';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { I18nService } from '@shared/i18n/i18n-service';
import { ConfigurationsStore } from '../configurations.store';
import { ConfigurationDefinitionDto } from '@api/models/configuration/configuration-definition-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface NewConfigurationForm {
  type: ConfigurationDefinitionDto | null;
  name: string;
  description: string;
}

@Component({
  selector: 'app-create-configuration',
  imports: [Button, FloatLabel, InputText, Select, Textarea, TranslocoPipe, FormsModule, FormField],
  templateUrl: './create-configuration.html',
  styleUrl: './create-configuration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateConfiguration {
  private readonly configurationsStore = inject(ConfigurationsStore);
  private readonly i18nService = inject(I18nService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(() => {
    this.i18nService.currentLanguage();
    return (
      this.configurationsStore.configurationTypes()?.map((type) => ({
        label: this.i18nService.localised(type.name, type.type),
        value: type,
      })) ?? []
    );
  });

  creationModel = signal<NewConfigurationForm>({
    type: null,
    name: '',
    description: '',
  });
  configurationForm = form<NewConfigurationForm>(
    this.creationModel,
    schema((path) => {
      required(path.type);
    }),
  );

  constructor() {
    this.initConfigName();
  }

  protected onConfigurationCreate() {
    const { type, name, description } = this.creationModel();
    const configType = type?.type;
    if (!configType || !name) {
      return;
    }
    this.configurationsStore
      .createPipeline$({
        type: configType,
        name,
        description,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((pipeline) =>
          this.router.navigate(['configuration', pipeline.id], { relativeTo: this.activatedRoute.parent }),
        ),
      )
      .subscribe();
  }

  private initConfigName() {
    effect(() => {
      const configName = this.configurationForm.type().value();
      if (configName?.name && this.configurationForm.name().value() === '') {
        this.configurationForm.name().value.set(this.i18nService.localised(configName.name));
      }
    });
  }
}
