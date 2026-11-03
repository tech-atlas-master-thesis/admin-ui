import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-metric-card',
  imports: [Card, Skeleton],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCard {
  label = input.required<string>();
  icon = input.required<string>();
  value = input<number>();
  loading = input(false);
  highlight = input(false);
}
