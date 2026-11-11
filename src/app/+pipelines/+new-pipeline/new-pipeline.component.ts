import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { PipelinesStore } from '../pipelines.store';
import { Select } from '@openng/optimus-ui/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { FloatLabel } from '@openng/optimus-ui/floatlabel';
import { NewPipelineForm } from './new-pipeline.interface';
import { form, FormField, required, schema } from '@angular/forms/signals';

import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService } from '@shared/i18n/i18n-service';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Textarea } from '@openng/optimus-ui/textarea';
import { StepConfiguration } from './step-configuration/step-configuration';
import { Button } from '@openng/optimus-ui/button';
import { PipelineService } from '../pipeline.service';
import { OptimusFormFieldSync } from '@shared/forms/optimus-form-field-sync';

@Component({
  selector: 'app-new-pipeline',
  imports: [
    Select,
    TranslocoPipe,
    FloatLabel,
    FormsModule,
    InputText,
    FormField,
    OptimusFormFieldSync,
    Textarea,
    StepConfiguration,
    Button,
  ],
  templateUrl: './new-pipeline.component.html',
  styleUrl: './new-pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPipeline {
  pipelinesStore = inject(PipelinesStore);
  pipelineService = inject(PipelineService);
  router = inject(Router);
  i18nService = inject(I18nService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  typeOptions = this.pipelineService.typeOptions;

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
        config: this.pipelineService.serializePipelineConfig(this.pipelineConfigForm()),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((pipeline) => this.router.navigate(['pipeline', pipeline.id], { relativeTo: this.activatedRoute.parent })),
      )
      .subscribe();
  }

  private initializePipelineName() {
    effect(() => {
      const pipelineType = this.pipelineForm.pipelineType().value();
      if (pipelineType?.displayName && this.pipelineForm.name().value() === '') {
        this.pipelineForm.name().value.set(this.i18nService.localised(pipelineType.displayName));
      }
    });
  }
}
