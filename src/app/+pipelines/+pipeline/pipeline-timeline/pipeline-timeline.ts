import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateClassPipe } from '@shared/styles/state-class.pipe';
import { NgClass } from '@angular/common';
import { PipelineStepsStore } from '../pipeline-steps.store';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-pipeline-timeline',
  imports: [StateClassPipe, NgClass, LocalisedPipe],
  templateUrl: './pipeline-timeline.html',
  styleUrl: './pipeline-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipelineTimeline {
  protected readonly pipelineStepsStore = inject(PipelineStepsStore);
  private readonly i18nService = inject(I18nService);

  currentLanguage = this.i18nService.currentLanguage;
}
