import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, Signal, signal } from '@angular/core';
import { DataSetStore } from './data-set.store';
import { DataSetObjectStore } from './data-set-object.store';
import { TranslocoPipe } from '@jsverse/transloco';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { DataSetObjects } from './data-set-objects/data-set-objects.component';
import { DataSetObjectsColumn } from './data-set-objects/data-set-objects.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, take, tap } from 'rxjs';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { Button } from 'primeng/button';
import { FileDownload } from '@shared/file/file-download';
import { DataSetObjectType } from '@api/models/dataset/data-set-object-type';

@Component({
  selector: 'app-dataset',
  imports: [TranslocoPipe, Tab, TabList, Tabs, TabPanels, TabPanel, DataSetObjects, Button],
  templateUrl: './data-set.component.html',
  styleUrl: './data-set.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSetComponent {
  protected readonly dataSetStore = inject(DataSetStore);
  protected readonly dataSetObjectStore = inject(DataSetObjectStore);
  protected readonly fileDownload = inject(FileDownload);
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);

  selectedTab = signal<DataSetObjectType>('projects');

  projectsCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.projectResource.value);
  organizationsCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.organizationResource.value);
  grantsCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.grantResource.value);
  programmesCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.programmesResources.value);
  technologiesCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.technologiesResources.value);
  fieldsCount = this.getFirstCountFromPaginated(this.dataSetObjectStore.fieldsResources.value);

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

  protected readonly grantColumns: DataSetObjectsColumn[] = [
    { labelKey: 'label.name', field: 'name' },
    {
      labelKey: 'label.programme',
      field: 'programme',
      displayFn: (field) => (Array.isArray(field) ? field.at(0).name : field),
    },
    { labelKey: 'label.projects', field: 'projects' },
  ];

  protected readonly programmeColumns: DataSetObjectsColumn[] = [
    { labelKey: 'label.name', field: 'name' },
    { labelKey: 'label.projects', field: 'projects' },
  ];

  protected readonly technologiesColumns: DataSetObjectsColumn[] = [
    {
      labelKey: 'label.name',
      field: 'label',
    },
    {
      labelKey: 'label.field',
      field: 'field',
      displayFn: (field) => (Array.isArray(field) ? field.at(0).label : field),
    },
    {
      labelKey: 'label.projects',
      field: 'projects',
    },
  ];

  protected readonly fieldsColumns: DataSetObjectsColumn[] = [
    {
      labelKey: 'label.name',
      field: 'label',
    },
    {
      labelKey: 'label.projects',
      field: 'projects',
    },
  ];

  private getFirstCountFromPaginated(totalCount: Signal<PaginatedListDto<unknown> | undefined>) {
    return toSignal(
      toObservable(totalCount).pipe(
        map((response) => response?.page.totalRecords),
        filter((value) => value !== undefined),
        take(1),
        startWith(undefined),
      ),
    );
  }

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
        tap((params) => this.selectedTab.set((params.get('object') as DataSetObjectType) ?? 'projects')),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  protected exportDataSet() {
    this.fileDownload
      .downloadFile$(this.dataSetStore.exportDataSet$())
      .pipe(tap(), takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
