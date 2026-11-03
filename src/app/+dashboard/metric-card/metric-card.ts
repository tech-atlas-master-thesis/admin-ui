import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@openng/optimus-ui/card';
import { Skeleton } from '@openng/optimus-ui/skeleton';

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
