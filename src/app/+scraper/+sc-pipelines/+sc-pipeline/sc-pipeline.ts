import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScPipelineStore } from './sc-pipeline.store';

@Component({
  selector: 'app-sc-pipeline',
  imports: [],
  templateUrl: './sc-pipeline.html',
  styleUrl: './sc-pipeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipeline {
  pipelineStore = inject(ScPipelineStore);
}
