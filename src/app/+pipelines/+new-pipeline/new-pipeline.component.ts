import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { PipelinesStore } from '../pipelines.store';
import { Select } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { FloatLabel } from 'primeng/floatlabel';
import { NewPipelineForm, PipelineConfigForm } from './new-pipeline.interface';
import { form, FormField, required, schema } from '@angular/forms/signals';
import { FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, of, startWith, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@shared/i18n/i18n-service';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';
import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';
import { UserConfigValueDto } from '@api/models/pipeline/user-config/user-config-value-dto';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { StepConfiguration } from './step-configuration/step-configuration';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-new-pipeline',
  imports: [Select, TranslocoPipe, FloatLabel, FormsModule, InputText, FormField, Textarea, StepConfiguration, Button],
  templateUrl: './new-pipeline.component.html',
  styleUrl: './new-pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPipeline {
  pipelinesStore = inject(PipelinesStore);
  pipelineApi = inject(PipelineApi);
  router = inject(Router);
  i18nService = inject(I18nService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  fb = inject(NonNullableFormBuilder);

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(() => {
    this.i18nService.currentLanguage();
    return (
      this.pipelinesStore.pipelineTypes()?.map((type) => ({
        label: this.i18nService.localised(type.displayName, type.type),
        value: type,
      })) ?? []
    );
  });

  creationModel = signal<NewPipelineForm>({
    pipelineType: null,
    name: '',
    description: '',
  });
  pipelineForm = form<NewPipelineForm>(
    this.creationModel,
    schema((path) => {
      required(path.pipelineType);
      required(path.name);
    }),
  );

  pipelineType = computed(() => this.pipelineForm.pipelineType().value()?.type);
  pipelineConfiguration = resource({
    params: this.pipelineType,
    loader: (pipelineType) =>
      firstValueFrom(
        pipelineType.params
          ? this.pipelineApi.getPipelineTypeConfigDefinition(pipelineType.params ?? '')
          : of(undefined),
      ),
  });

  userConfigDefinition = computed(() => {
    const userConfig = this.pipelineConfiguration.value();
    return Object.fromEntries(
      userConfig?.map((stepConfig) => [
        stepConfig.name,
        Object.fromEntries(stepConfig.userConfig?.map((config) => [config.name, config]) ?? []),
      ]) ?? [],
    );
  });
  stepConfigDefinition = computed(() => {
    const userConfig = this.pipelineConfiguration.value();
    return Object.fromEntries(userConfig?.map((stepConfig) => [stepConfig.name, stepConfig]) ?? []);
  });

  userConfig = linkedSignal<UserConfigDto>(() => {
    const userConfig = this.pipelineConfiguration.value();
    if (!userConfig) {
      return {};
    }
    return Object.fromEntries(
      userConfig.map((stepConfig) => [
        stepConfig.name,
        Object.fromEntries(stepConfig.userConfig?.map((config) => [config.name, config.defaultValue ?? null]) ?? []),
      ]),
    );
  });

  pipelineConfigForm = computed(() => this.getPipelineForm(this.userConfigDefinition()));
  configFormValid = toSignal(
    toObservable(this.pipelineConfigForm).pipe(
      switchMap((form) => form.statusChanges.pipe(startWith(form.status))),
      map((status) => status === 'VALID'),
    ),
  );

  protected onPipelineCreate() {
    const { pipelineType, name, description } = this.creationModel();
    const type = pipelineType?.type;
    if (!type || !name) {
      return;
    }
    this.pipelinesStore
      .createPipeline$({
        type,
        name,
        description,
        config: Object.fromEntries(
          Object.entries(this.pipelineConfigForm().value)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [
              key,
              Object.fromEntries(Object.entries(value ?? {}).filter(([, value]) => value !== undefined)),
            ]),
        ),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((pipeline) => this.router.navigate(['pipeline', pipeline.id], { relativeTo: this.activatedRoute.parent })),
      )
      .subscribe();
  }

  private getPipelineForm(userConfig: Record<string, Record<string, UserConfigDefinitionDto>>): PipelineConfigForm {
    return this.fb.group(
      Object.fromEntries(
        Object.entries(userConfig).map(([stepName, stepConfig]) => [
          stepName,
          this.fb.group(
            Object.fromEntries(
              Object.entries(stepConfig).map(([configName, config]) => {
                return [
                  configName,
                  this.fb.control<UserConfigValueDto | undefined>(config.defaultValue, Validators.required),
                ];
              }),
            ),
          ),
        ]),
      ),
    );
  }
}
