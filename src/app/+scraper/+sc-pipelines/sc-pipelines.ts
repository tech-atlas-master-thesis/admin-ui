import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScPipelinesStore } from './sc-pipelines.store';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-sc-pipelines',
  imports: [TableModule, RouterLink, TranslocoPipe, Button],
  templateUrl: './sc-pipelines.html',
  styleUrl: './sc-pipelines.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipelines {
  scPipelinesStore = inject(ScPipelinesStore);
}
