import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input } from '@angular/core';
import { StepDto } from '@api/models/pipeline/step-dto';
import { StateDto } from '@api/models/pipeline/state-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { StepResultType } from '@api/models/pipeline/step-result-dto';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipelineStore } from '../../pipeline.store';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Button } from 'primeng/button';
import { HttpEvent, HttpEventType } from '@angular/common/http';

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
  private readonly destroyRef = inject(DestroyRef);

  step = input<StepDto>();
  result = computed(() => this.step()?.result);

  downloadResult() {
    const stepId = this.step()?.id;
    const pipelineId = this.pipelineStore.pipelineId();
    if (!stepId || !pipelineId) {
      return;
    }
    this.scraperApi
      .downloadStepResult(pipelineId, stepId)
      .pipe(
        tap((event: HttpEvent<Blob>) => {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
              // TODO: create better progress display
              return;
            case HttpEventType.Response: {
              if (!event.body) {
                return;
              }
              const element = document.createElement('a');
              document.body.appendChild(element);
              element.style.display = 'none';
              const url = globalThis.URL.createObjectURL(event.body);
              const contentDisposition = event.headers.get('Content-Disposition');
              element.href = url;
              element.download = contentDisposition?.replace('inline; filename=', '') ?? 'result.csv';
              element.click();
              globalThis.URL.revokeObjectURL(url);
              element.remove();
              return;
            }
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
