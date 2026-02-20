import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { ScPipelineStepsStore } from '../sc-pipeline-steps.store';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-sc-pipeline-step',
  imports: [DatePipe, TableModule, TranslocoPipe, NgxJsonViewerModule],
  templateUrl: './sc-pipeline-step.html',
  styleUrl: './sc-pipeline-step.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipelineStep {
  protected readonly JSON = JSON;

  protected readonly pipelineStepsStore = inject(ScPipelineStepsStore);
}
