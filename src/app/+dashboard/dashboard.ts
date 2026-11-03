import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TableSkeleton } from '@shared/table/table-skeleton/table-skeleton';
import { CronOptions } from '../+schedules/shared/cron-options';
import { DashboardStore } from './dashboard.store';
import { MetricCard } from './metric-card/metric-card';

@Component({
  selector: 'app-dashboard',
  imports: [
    Button,
    Card,
    DatePipe,
    Message,
    MetricCard,
    NgTemplateOutlet,
    RouterLink,
    TableModule,
    TableSkeleton,
    TranslocoPipe,
  ],
  // Provided per component instance, so that every visit of the dashboard requests fresh data
  providers: [DashboardStore],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  protected readonly dashboardStore = inject(DashboardStore);
  protected readonly cronLabels = new Map(CronOptions.map((option) => [option.value, option.label]));
}
