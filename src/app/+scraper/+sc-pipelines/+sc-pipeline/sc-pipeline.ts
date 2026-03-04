import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScPipelineStore } from './sc-pipeline.store';
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
}
