import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DataSetStore } from './data-set.store';
import { DataSetObjectStore } from './data-set-object.store';
import { TranslocoPipe } from '@jsverse/transloco';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { DataSetObjects } from './data-set-objects/data-set-objects.component';
import { DataSetObjectsColumn } from './data-set-objects/data-set-objects.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dataset',
  imports: [TranslocoPipe, Tab, TabList, Tabs, TabPanels, TabPanel, DataSetObjects],
  templateUrl: './data-set.component.html',
  styleUrl: './data-set.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSetComponent {
  protected readonly dataSetStore = inject(DataSetStore);
  protected readonly dataSetObjectStore = inject(DataSetObjectStore);
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);

  selectedTab = signal<number>(0);

  constructor() {
    this.initTabChangePersistence();
  }

  protected readonly projectColumns: DataSetObjectsColumn[] = [
    {
      labelKey: 'label.title',
      field: 'short',
      tooltipField: 'title',
      sort: 'short',
    },
    {
      labelKey: 'label.status',
      field: 'status',
    },
  ];

  protected readonly organizationColumns: DataSetObjectsColumn[] = [
    {
      labelKey: 'label.name',
      field: 'name',
      sort: 'short',
    },
    {
      labelKey: 'label.type',
      field: 'type',
    },
  ];

  protected readonly grantColumns: DataSetObjectsColumn[] = [];

  private initTabChangePersistence() {
    effect(() => {
      const tab = this.selectedTab();
      this.router.navigate([], {
        queryParams: {
          object: tab,
        },
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute,
        replaceUrl: true,
      });
    });

    this.activatedRoute.queryParamMap
      .pipe(
        tap((params) => {
          const param = params.get('object');
          const tab = Number.parseInt(param ?? '');
          this.selectedTab.set(Number.isNaN(tab) ? 0 : tab);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
