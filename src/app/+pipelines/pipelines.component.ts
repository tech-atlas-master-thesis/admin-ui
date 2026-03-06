import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PipelinesStore } from './pipelines.store';
import { TableModule } from 'primeng/table';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-pipelines',
  imports: [TableModule, RouterLink, TranslocoPipe, Button],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pipelines {
  scPipelinesStore = inject(PipelinesStore);
}
