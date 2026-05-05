import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DataSetObjectStore } from '../data-set-object.store';
import { DataSetObjectType } from '@api/models/dataset/data-set-object-type';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TableConstants } from '@shared/contants/table.constants';
import { TranslocoPipe } from '@jsverse/transloco';
import { InfoPanel } from '@shared/info-panel/info-panel';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { DataSetObjectsColumn } from './data-set-objects.interface';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-data-set-objects',
  imports: [TableModule, TranslocoPipe, InfoPanel, NgxJsonViewerModule, Tooltip],
  templateUrl: './data-set-objects.component.html',
  styleUrl: './data-set-objects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSetObjects {
  private dataSetObjectStore = inject(DataSetObjectStore);

  objectType = input.required<DataSetObjectType>();
  additionalColumns = input<DataSetObjectsColumn[]>([]);

  objectResource = computed(() => this.dataSetObjectStore.getObjectTypeResource(this.objectType()));

  pageState = computed(() => this.dataSetObjectStore[this.objectType()]());
  error = computed(() => this.objectResource().error());
  loading = computed(() => this.objectResource().isLoading());
  data = computed(() => this.objectResource().value());
  protected readonly TableConstants = TableConstants;

  protected onSort(event: object) {
    this.dataSetObjectStore.changeSort(this.objectType(), event);
  }

  protected onPage(event: TablePageEvent) {
    this.dataSetObjectStore.changePage(this.objectType(), event);
  }

  protected readonly dispatchEvent = dispatchEvent;
}
