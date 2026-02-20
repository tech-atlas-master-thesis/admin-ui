import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ScPipelineStore } from './sc-pipeline.store';
import { ScPipelineStepsStore } from './sc-pipeline-steps.store';
import { StepDto } from '../../../api/models/step-dto';
import { TableModule } from 'primeng/table';
import { ScPipelineStep } from './sc-pipeline-step/sc-pipeline-step';
import { ScPipelineTimeline } from './sc-pipeline-timeline/sc-pipeline-timeline';

@Component({
  selector: 'app-sc-pipeline',
  imports: [TableModule, ScPipelineStep, ScPipelineTimeline],
  templateUrl: './sc-pipeline.html',
  styleUrl: './sc-pipeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipeline {
  pipelineStore = inject(ScPipelineStore);
  stepsStore = inject(ScPipelineStepsStore);

  selectedStep = signal<StepDto | undefined>(undefined);

  constructor() {
    effect(() => {
      console.log(this.selectedStep());
    });
  }

  protected onStepSelect(step: StepDto) {
    this.selectedStep.set(step);
  }

  protected readonly String = String;
  protected readonly JSON = JSON;
}
