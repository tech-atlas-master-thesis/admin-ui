import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ScPipelinesStore } from '../sc-pipelines.store';
import { Select } from 'primeng/select';
import { SelectItem } from 'primeng/api';
import { PipelineConfigDto } from '../../../api/models/pipeline-config-dto';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { ScNewPipelineForm } from './sc-new-pipeline.interface';
import { form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sc-new-pipeline',
  imports: [Select, TranslocoPipe, Button, FloatLabel, FormsModule],
  templateUrl: './sc-new-pipeline.html',
  styleUrl: './sc-new-pipeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScNewPipeline {
  scPipelinesStore = inject(ScPipelinesStore);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(
    () =>
      this.scPipelinesStore.pipelineTypes()?.map((type) => ({ label: type.displayName ?? type.name, value: type })) ??
      [],
  );

  creationModel = signal<ScNewPipelineForm>({
    pipelineType: null,
  });
  pipelineForm = form<ScNewPipelineForm>(this.creationModel);

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
