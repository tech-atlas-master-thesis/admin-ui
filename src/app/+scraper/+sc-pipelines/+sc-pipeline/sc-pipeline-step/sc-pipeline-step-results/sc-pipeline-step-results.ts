import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { StepDto } from '@api/models/step-dto';
import { StatusDto } from '@api/models/status-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { StepResultType } from '@api/models/step-result-dto';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ScPipelineStore } from '../../sc-pipeline.store';
import { ScraperApi } from '@api/scraper-api/scraper-api';

@Component({
  selector: 'app-sc-pipeline-step-results',
  imports: [TranslocoPipe, NgxJsonViewerModule],
  templateUrl: './sc-pipeline-step-results.html',
  styleUrl: './sc-pipeline-step-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipelineStepResults {
  protected readonly StatusDto = StatusDto;
  protected readonly StepResultType = StepResultType;

  private readonly pipelineStore = inject(ScPipelineStore);
  private readonly scraperApi = inject(ScraperApi);

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
