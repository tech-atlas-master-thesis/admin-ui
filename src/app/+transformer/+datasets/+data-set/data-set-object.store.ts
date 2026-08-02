import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject, resource } from '@angular/core';
import { firstValueFrom, fromEvent, Observable, of, takeUntil } from 'rxjs';
import { TransformerApi } from '@api/service/transformer-api';
import { DataSetObjectType } from '@api/models/dataset/data-set-object-type';
import { PaginatorState } from 'primeng/paginator';
import { SortMeta } from 'primeng/api';
import { TableConstants } from '@shared/contants/table.constants';
import { DataSetStore } from './data-set.store';
import { SortUtil } from '@shared/util/sort';
import { HttpEvent } from '@angular/common/http';

interface DataSetObjectState {
  pagination: PaginatorState;
  search: string | undefined;
  sort: SortMeta[];
  includeData: boolean | undefined;
}
type DataSetObjectStoreState = Record<DataSetObjectType, DataSetObjectState>;

const DEFAULT_STATE = {
  pagination: TableConstants.INITIAL_STATE,
  search: undefined,
  sort: [{ field: '_id', order: -1 }],
  includeData: false,
};

function resourceLoader(objectType: DataSetObjectType, transformerApi: TransformerApi) {
  return ({
    params: { dataSetId, pagination, sort, search, includeData },
    abortSignal,
  }: {
    params: { dataSetId: string | undefined } & DataSetObjectState;
    abortSignal: AbortSignal;
  }) =>
    firstValueFrom(
      dataSetId !== undefined
        ? transformerApi
            .getDataSetObject(dataSetId, objectType, pagination, search, sort, includeData)
            .pipe(takeUntil(fromEvent(abortSignal, 'abort')))
        : of(),
    );
}

export const DataSetObjectStore = signalStore(
  withState<DataSetObjectStoreState>({
    projects: DEFAULT_STATE,
    organizations: DEFAULT_STATE,
    grants: DEFAULT_STATE,
    programmes: DEFAULT_STATE,
    technologies: DEFAULT_STATE,
    fields: DEFAULT_STATE,
  }),
  withProps(() => ({
    _transformerApi: inject(TransformerApi),
    _dataSetStore: inject(DataSetStore),
  })),
  withProps((store) => ({
    projectResource: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.projects(),
      }),
      loader: resourceLoader('projects', store._transformerApi),
    }),
    organizationResource: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.organizations(),
      }),
      loader: resourceLoader('organizations', store._transformerApi),
    }),
    grantResource: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.grants(),
      }),
      loader: resourceLoader('grants', store._transformerApi),
    }),
    programmesResources: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.fields(),
      }),
      loader: resourceLoader('programmes', store._transformerApi),
    }),
    technologiesResources: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.technologies(),
      }),
      loader: resourceLoader('technologies', store._transformerApi),
    }),
    fieldsResources: resource({
      params: () => ({
        dataSetId: store._dataSetStore.dataSetId(),
        ...store.fields(),
      }),
      loader: resourceLoader('fields', store._transformerApi),
    }),
  })),
  withMethods((store) => {
    function reload(type?: DataSetObjectType) {
      if (!type || type == 'projects') {
        store.projectResource.reload();
      }
      if (!type || type == 'organizations') {
        store.organizationResource.reload();
      }
      if (!type || type == 'grants') {
        store.grantResource.reload();
      }
      if (!type || type == 'programmes') {
        store.programmesResources.reload();
      }
      if (!type || type == 'technologies') {
        store.technologiesResources.reload();
      }
      if (!type || type == 'fields') {
        store.fieldsResources.reload();
      }
    }

    function getObjectTypeResource(type: DataSetObjectType) {
      switch (type) {
        case 'projects':
          return store.projectResource;
        case 'organizations':
          return store.organizationResource;
        case 'grants':
          return store.grantResource;
        case 'programmes':
          return store.programmesResources;
        case 'technologies':
          return store.technologiesResources;
        case 'fields':
          return store.fieldsResources;
      }
    }

    function changePage(type: DataSetObjectType, pagination: PaginatorState) {
      patchState(store, { [type]: { ...store[type](), pagination } });
    }

    function changeSearch(type: DataSetObjectType, search?: string) {
      patchState(store, { [type]: { ...store[type](), search } });
    }

    function changeSort(type: DataSetObjectType, sort: object) {
      if (!SortUtil.isMultiSort(sort)) {
        return;
      }
      patchState(store, { [type]: { ...store[type](), sort: sort.multisortmeta } });
    }

    function changeIncludeData(type: DataSetObjectType, includeData: boolean) {
      patchState(store, { [type]: { ...store[type](), includeData } });
    }

    function exportDataSet$(type: DataSetObjectType): Observable<HttpEvent<Blob> | undefined> {
      const dataSetId = store._dataSetStore.dataSetId();
      if (!dataSetId) {
        return of(undefined);
      }
      return store._transformerApi.exportDataSetObjects(
        dataSetId,
        type,
        store[type].search(),
        store[type].includeData(),
      );
    }

    return {
      reload,
      getObjectTypeResource,
      changePage,
      changeSearch,
      changeSort,
      changeIncludeData,
      exportDataSet$,
    };
  }),
);
