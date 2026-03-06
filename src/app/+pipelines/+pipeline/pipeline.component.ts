import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelineStore } from './pipeline.store';
import { TableModule } from 'primeng/table';
import { PipelineStep } from './pipeline-step/pipeline-step.component';
import { PipelineTimeline } from './pipeline-timeline/pipeline-timeline';

@Component({
  selector: 'app-pipeline',
  imports: [TableModule, PipelineStep, PipelineTimeline],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipeline {
  pipelineStore = inject(PipelineStore);
}
