import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, linkedSignal } from '@angular/core';
import { Button } from '@openng/optimus-ui/button';
import { Checkbox } from '@openng/optimus-ui/checkbox';
import { InputText } from '@openng/optimus-ui/inputtext';
import { StepConfiguration } from '../../+pipelines/+new-pipeline/step-configuration/step-configuration';
import { Textarea } from '@openng/optimus-ui/textarea';
import { TranslocoPipe } from '@jsverse/transloco';
import { disabled, form, FormField, readonly, required, schema, validate } from '@angular/forms/signals';

import { FormsModule } from '@angular/forms';
import { SchedulesStore } from '../schedules.store';
import { PipelineService } from '../../+pipelines/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@shared/i18n/i18n-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap } from 'rxjs';
import { ScheduleStore } from './schedule.store';
import { ScheduleForm } from './schedule.interface';
import { scheduleCronValidator } from '../validator/cron-validator';
import { Select } from '@openng/optimus-ui/select';
import { CronOptions } from '../shared/cron-options';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { OptimusFormFieldSync } from '@shared/forms/optimus-form-field-sync';

@Component({
  selector: 'app-schedule',
  imports: [
    Button,
    Checkbox,
    FormsModule,
    InputText,
    StepConfiguration,
    Textarea,
    TranslocoPipe,
    FormField,
    OptimusFormFieldSync,
    Select,
    Tooltip,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {
  schedulesStore = inject(SchedulesStore);
  scheduleStore = inject(ScheduleStore);
  pipelineService = inject(PipelineService);
  router = inject(Router);
  i18nService = inject(I18nService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  typeOptions = this.pipelineService.typeOptions;
  cronOptions = computed(() => {
    this.i18nService.currentLanguage();
    return CronOptions.map((option) => ({
      ...option,
      label: option.label ? this.i18nService.instant(option.label) : undefined,
    }));
  });

  creationModel = linkedSignal<ScheduleForm>(() => {
    const schedule = this.scheduleStore.schedule();
    return {
      id: schedule?.id ?? '',
      pipelineType: schedule?.pipeline.type ? { type: schedule?.pipeline.type } : null,
      name: schedule?.pipeline.name ?? '',
      description: schedule?.pipeline.description ?? '',
      cron: schedule?.cron ?? '',
      active: schedule?.active ?? false,
      edit: false,
    };
  });
  scheduleForm = form<ScheduleForm>(
    this.creationModel,
    schema((path) => {
      required(path.pipelineType);
      required(path.name);
      disabled(path.pipelineType);
      readonly(path, (p) => !p.value().edit);
      validate(path.cron, scheduleCronValidator);
    }),
  );

  pipelineType = computed(() => this.scheduleForm.pipelineType().value()?.type);
  pipelineConfiguration = this.pipelineService.getPipelineConfigDefinition(this.pipelineType);

  userConfigDefinition = computed(() =>
    this.pipelineService.getUserConfigDefinition(this.pipelineConfiguration.value()),
  );
  stepConfigDefinition = computed(() => {
    const userConfig = this.pipelineConfiguration.value();
    return Object.fromEntries(userConfig?.map((stepConfig) => [stepConfig.name, stepConfig]) ?? []);
  });

  pipelineConfigForm = computed(() =>
    this.pipelineService.getPipelineForm(this.userConfigDefinition(), this.scheduleStore.schedule()?.pipeline.config),
  );
  configFormValid = toSignal(
    toObservable(this.pipelineConfigForm).pipe(
      switchMap((form) => form.statusChanges.pipe(startWith(form.status))),
      map((status) => status === 'VALID'),
    ),
  );

  constructor() {
    this.initializePipelineName();
  }

  protected onTrigger() {
    const schedule = this.scheduleStore.schedule();
    if (!schedule) {
      return;
    }
    this.schedulesStore.triggerSchedule$(schedule.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  protected onEdit() {
    this.scheduleForm.edit().value.set(true);
  }

  protected onCancel() {
    this.scheduleForm.edit().value.set(false);
    const schedule = this.scheduleStore.schedule();
    this.creationModel.set({
      id: schedule?.id ?? '',
      pipelineType: schedule?.pipeline.type ? { type: schedule?.pipeline.type } : null,
      name: schedule?.pipeline.name ?? '',
      description: schedule?.pipeline.description ?? '',
      cron: schedule?.cron ?? '',
      active: schedule?.active ?? false,
      edit: false,
    });
    this.pipelineService.resetPipelineForm(this.pipelineConfigForm(), schedule?.pipeline.config);
  }

  protected onScheduleUpdate() {
    const { id, pipelineType, name, description, active, cron } = this.creationModel();
    const type = pipelineType?.type;
    if (!type || !name) {
      return;
    }
    this.scheduleStore
      .updateSchedule$(id, {
        pipeline: {
          type,
          name,
          description,
          config: this.pipelineService.serializePipelineConfig(this.pipelineConfigForm()),
        },
        active,
        cron,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private initializePipelineName() {
    effect(() => {
      const pipelineType = this.scheduleForm.pipelineType().value();
      if (pipelineType?.displayName && this.scheduleForm.name().value() === '') {
        this.scheduleForm.name().value.set(this.i18nService.localised(pipelineType.displayName));
      }
    });
  }
}
