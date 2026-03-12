import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { FieldTree, MaybeFieldTree } from '@angular/forms/signals';
import { CONFIG_DEFINITION, STEP_DEFINITION } from '../new-pipeline.metadata';
import { PipelineConfigForm } from '../new-pipeline.interface';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-step-configuration',
  imports: [LocalisedPipe],
  templateUrl: './step-configuration.html',
  styleUrl: './step-configuration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepConfiguration {
  protected readonly Object = Object;
  protected readonly CONFIG_DEFINITION = CONFIG_DEFINITION;

  configForm = input.required<PipelineConfigForm>();
  configDefinition = input.required<Record<string, StepConfigDto>>();
  isLoading = input<boolean>();

  language = inject(I18nService).currentLanguage;

  constructor() {
    effect(() => {
      console.log(this.configForm().value);
    });
  }

  protected readonly STEP_DEFINITION = STEP_DEFINITION;

  protected isFieldTree<T>(field: MaybeFieldTree<T>): field is FieldTree<Exclude<T, undefined>> {
    return !!field?.name;
  }
}
