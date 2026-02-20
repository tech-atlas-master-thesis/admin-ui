import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateClassPipe } from '../../../../shared/styles/state-class.pipe';
import { NgClass } from '@angular/common';
import { ScPipelineStepsStore } from '../sc-pipeline-steps.store';

@Component({
  selector: 'app-sc-pipeline-timeline',
  imports: [StateClassPipe, NgClass],
  templateUrl: './sc-pipeline-timeline.html',
  styleUrl: './sc-pipeline-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipelineTimeline {
  protected readonly pipelineStepsStore = inject(ScPipelineStepsStore);
}
