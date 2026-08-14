import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { StepConfiguration } from '../../+pipelines/+new-pipeline/step-configuration/step-configuration';
import { Textarea } from 'primeng/textarea';
import { TranslocoPipe } from '@jsverse/transloco';
import { PipelineService } from '../../+pipelines/pipeline.service';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@shared/i18n/i18n-service';
import { form, FormField, required, schema, validate } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NewScheduleForm } from './new-schedule.interface';
import { SchedulesStore } from '../schedules.store';
import { Checkbox } from 'primeng/checkbox';
import { scheduleCronValidator } from '../validator/cron-validator';
import { CronOptions } from '../shared/cron-options';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-new-schedule',
  imports: [
    Button,
    FloatLabel,
    InputText,
    Select,
    StepConfiguration,
    Textarea,
    TranslocoPipe,
    FormsModule,
    FormField,
    Checkbox,
    Tooltip,
  ],
  templateUrl: './new-schedule.component.html',
  styleUrl: './new-schedule.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewScheduleComponent {
  schedulesStore = inject(SchedulesStore);
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

  creationModel = signal<NewScheduleForm>({
    pipelineType: null,
    name: '',
    description: '',
    cron: '',
    active: true,
  });
  scheduleForm = form<NewScheduleForm>(
    this.creationModel,
    schema((path) => {
      required(path.pipelineType);
      required(path.name);
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

  pipelineConfigForm = computed(() => this.pipelineService.getPipelineForm(this.userConfigDefinition()));
  configFormValid = toSignal(
    toObservable(this.pipelineConfigForm).pipe(
      switchMap((form) => form.statusChanges.pipe(startWith(form.status))),
      map((status) => status === 'VALID'),
    ),
  );

  constructor() {
    this.initializePipelineName();
  }

  protected onScheduleCreate() {
    const { pipelineType, name, description, active, cron } = this.creationModel();
    const type = pipelineType?.type;
    if (!type || !name) {
      return;
    }
    this.schedulesStore
      .createSchedule$({
        pipeline: {
          type,
          name,
          description,
          config: this.pipelineService.serializePipelineConfig(this.pipelineConfigForm()),
        },
        active,
        cron,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((pipeline) => this.router.navigate(['pipeline', pipeline.id], { relativeTo: this.activatedRoute.parent })),
      )
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
