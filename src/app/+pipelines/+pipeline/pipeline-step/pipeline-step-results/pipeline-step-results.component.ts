import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input } from '@angular/core';
import { StepDto } from '@api/models/pipeline/step-dto';
import { StateDto } from '@api/models/pipeline/state-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { StepResultType } from '@api/models/pipeline/step-result-dto';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipelineStore } from '../../pipeline.store';
import { PipelineApi } from '@api/service/pipeline-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';
import { FileDownload } from '@shared/file/file-download';

@Component({
  selector: 'app-pipeline-step-results',
  imports: [TranslocoPipe, NgxJsonViewerModule, Button],
  templateUrl: './pipeline-step-results.component.html',
  styleUrl: './pipeline-step-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineStepResults {
  protected readonly StatusDto = StateDto;
  protected readonly StepResultType = StepResultType;

  private readonly pipelineStore = inject(PipelineStore);
  private readonly scraperApi = inject(PipelineApi);
  private readonly fileDownload = inject(FileDownload);
  private readonly destroyRef = inject(DestroyRef);

  step = input<StepDto>();
  result = computed(() => this.step()?.result);

  downloadResult() {
    const stepId = this.step()?.id;
    const pipelineId = this.pipelineStore.pipelineId();
    if (!stepId || !pipelineId) {
      return;
    }
    this.fileDownload
      .downloadFile$(this.scraperApi.downloadStepResult(pipelineId, stepId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
