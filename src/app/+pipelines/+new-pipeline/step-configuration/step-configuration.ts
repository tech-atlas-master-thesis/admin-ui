import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PipelineConfigForm } from '../new-pipeline.interface';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { ConfigurationValue } from './configuration-value/configuration-value';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-step-configuration',
  imports: [LocalisedPipe, ConfigurationValue, TranslocoPipe],
  templateUrl: './step-configuration.html',
  styleUrl: './step-configuration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepConfiguration {
  protected readonly Object = Object;

  configForm = input.required<PipelineConfigForm>();
  configDefinition = input.required<Record<string, StepConfigDto>>();
  isLoading = input<boolean>();
}
