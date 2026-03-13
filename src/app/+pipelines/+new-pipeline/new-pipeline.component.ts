import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
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
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { NewPipelineForm, PipelineConfigForm } from './new-pipeline.interface';
import { form, required, schema } from '@angular/forms/signals';
import { FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';
import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';
import { StepConfiguration } from './step-configuration/step-configuration';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';
import { UserConfigValueDto } from '@api/models/pipeline/user-config/user-config-value-dto';

@Component({
  selector: 'app-new-pipeline',
  imports: [Select, TranslocoPipe, Button, FloatLabel, FormsModule, StepConfiguration],
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

  localisedPipe = new LocalisedPipe();

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(() => {
    this.i18nService.currentLanguage();
    return (
      this.pipelinesStore.pipelineTypes()?.map((type) => ({
        label: this.localisedPipe.transform(type.displayName, type.name),
        value: type,
      })) ?? []
    );
  });

  creationModel = signal<NewPipelineForm>({
    pipelineType: null,
  });
  pipelineForm = form<NewPipelineForm>(
    this.creationModel,
    schema((path) => required(path.pipelineType)),
  );

  pipelineType = computed(() => this.pipelineForm.pipelineType().value()?.name);
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
      switchMap((form) => form.statusChanges),
      map((status) => status === 'VALID'),
    ),
  );

  constructor() {
    effect(() => {
      console.log(
        this.pipelineForm().invalid(),
        this.configFormValid(),
        this.pipelineConfiguration.isLoading(),
        this.pipelineForm().invalid() || !this.configFormValid() || this.pipelineConfiguration.isLoading(),
      );
    });
  }

  protected onPipelineCreate() {
    const name = this.creationModel().pipelineType?.name;
    if (!name) {
      return;
    }
    this.pipelinesStore
      .createPipeline$({ name, config: {} })
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
