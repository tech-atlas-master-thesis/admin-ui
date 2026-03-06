import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateClassPipe } from '@shared/styles/state-class.pipe';
import { NgClass } from '@angular/common';
import { PipelineStepsStore } from '../pipeline-steps.store';

@Component({
  selector: 'app-pipeline-timeline',
  imports: [StateClassPipe, NgClass],
  templateUrl: './pipeline-timeline.html',
  styleUrl: './pipeline-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineTimeline {
  protected readonly pipelineStepsStore = inject(PipelineStepsStore);
}
