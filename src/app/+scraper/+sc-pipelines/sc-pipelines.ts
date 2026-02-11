import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScPipelinesStore } from './sc-pipelines.store';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sc-pipelines',
  imports: [TableModule, RouterLink],
  templateUrl: './sc-pipelines.html',
  styleUrl: './sc-pipelines.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScPipelines {
  scPipelinesStore = inject(ScPipelinesStore);
}
