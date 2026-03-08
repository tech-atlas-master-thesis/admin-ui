import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { PipelinesStore } from '../pipelines.store';
import { Select } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { NewPipelineForm } from './new-pipeline.interface';
import { form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { I18nService } from '@shared/i18n/i18n-service';

@Component({
  selector: 'app-new-pipeline',
  imports: [Select, TranslocoPipe, Button, FloatLabel, FormsModule],
  templateUrl: './new-pipeline.component.html',
  styleUrl: './new-pipeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPipeline {
  scPipelinesStore = inject(PipelinesStore);
  router = inject(Router);
  i18nService = inject(I18nService);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  localisedPipe = new LocalisedPipe();

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(
    () =>
      this.scPipelinesStore.pipelineTypes()?.map((type) => ({
        label: this.localisedPipe.transform(type.displayName, this.i18nService.currentLanguage(), type.name),
        value: type,
      })) ?? [],
  );

  creationModel = signal<NewPipelineForm>({
    pipelineType: null,
  });
  pipelineForm = form<NewPipelineForm>(this.creationModel);

  protected onPipelineCreate() {
    const name = this.creationModel().pipelineType?.name;
    if (!name) {
      return;
    }
    this.scPipelinesStore
      .createPipeline$({ name, config: {} })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((pipeline) => this.router.navigate(['pipeline', pipeline.id], { relativeTo: this.activatedRoute.parent })),
      )
      .subscribe();
  }
}
