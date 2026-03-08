import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslocoPipe } from '@jsverse/transloco';
import { PipelineStepsStore } from '../pipeline-steps.store';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PipelineStepResults } from './pipeline-step-results/pipeline-step-results.component';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-pipeline-step',
  imports: [DatePipe, TableModule, TranslocoPipe, NgxJsonViewerModule, PipelineStepResults, LocalisedPipe],
  templateUrl: './pipeline-step.component.html',
  styleUrl: './pipeline-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineStep {
  protected readonly pipelineStepsStore = inject(PipelineStepsStore);
  protected readonly i18nService = inject(I18nService);

  currentLanguage = this.i18nService.currentLanguage;
}
