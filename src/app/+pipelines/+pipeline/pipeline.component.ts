import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelineStore } from './pipeline.store';
import { TableModule } from 'primeng/table';
import { PipelineStep } from './pipeline-step/pipeline-step.component';
import { PipelineTimeline } from './pipeline-timeline/pipeline-timeline';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-pipeline',
  imports: [TableModule, PipelineStep, PipelineTimeline, LocalisedPipe],
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipeline {
  protected readonly pipelineStore = inject(PipelineStore);
  private readonly i18nService = inject(I18nService);

  currentLanguage = this.i18nService.currentLanguage;
}
