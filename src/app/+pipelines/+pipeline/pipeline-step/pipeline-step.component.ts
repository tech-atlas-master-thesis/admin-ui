import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { PipelineStepsStore } from '../pipeline-steps.store';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipelineStepResults } from './pipeline-step-results/pipeline-step-results.component';

@Component({
  selector: 'app-pipeline-step',
  imports: [DatePipe, TableModule, TranslocoPipe, NgxJsonViewerModule, PipelineStepResults],
  templateUrl: './pipeline-step.component.html',
  styleUrl: './pipeline-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineStep {
  protected readonly pipelineStepsStore = inject(PipelineStepsStore);
}
