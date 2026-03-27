import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { StepDto } from '@api/models/pipeline/step-dto';
import { StateDto } from '@api/models/pipeline/state-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { StepResultType } from '@api/models/pipeline/step-result-dto';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipelineStore } from '../../pipeline.store';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';

@Component({
  selector: 'app-pipeline-step-results',
  imports: [TranslocoPipe, NgxJsonViewerModule],
  templateUrl: './pipeline-step-results.component.html',
  styleUrl: './pipeline-step-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineStepResults {
  protected readonly StatusDto = StateDto;
  protected readonly StepResultType = StepResultType;

  private readonly pipelineStore = inject(PipelineStore);
  private readonly scraperApi = inject(PipelineApi);

  step = input<StepDto>();
  result = computed(() => this.step()?.result);
  resultFileURI = computed(() => {
    const stepId = this.step()?.id;
    const pipelineId = this.pipelineStore.pipelineId();
    if (!this.result()?.preview || stepId === undefined || pipelineId === undefined) {
      return undefined;
    }
    return this.scraperApi.getStepResultFilePath(pipelineId, stepId);
  });
}
