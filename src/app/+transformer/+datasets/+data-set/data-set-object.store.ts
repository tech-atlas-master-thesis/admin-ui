import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject, resource } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { TransformerApi } from '@api/pipeline-api/transformer-api';
import { DataSetObjectType } from '@api/models/dataset/data-set-object-type';
import { PaginatorState } from 'primeng/paginator';
import { SortMeta } from 'primeng/api';
import { TableConstants } from '@shared/contants/table.constants';
import { DataSetStore } from './data-set.store';
import { SortUtil } from '@shared/util/sort';

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
  }: {
    params: { dataSetId: string | undefined } & DataSetObjectState;
  }) =>
    firstValueFrom(
      dataSetId !== undefined
        ? transformerApi.getDataSetObject(dataSetId, objectType, pagination, search, sort, includeData)
        : of(),
    );
}

export const DataSetObjectStore = signalStore(
  withState<DataSetObjectStoreState>({
    projects: DEFAULT_STATE,
    organizations: DEFAULT_STATE,
    grants: DEFAULT_STATE,
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
    }

    function getObjectTypeResource(type: DataSetObjectType) {
      switch (type) {
        case 'projects':
          return store.projectResource;
        case 'organizations':
          return store.organizationResource;
        case 'grants':
          return store.grantResource;
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

    return {
      reload,
      getObjectTypeResource,
      changePage,
      changeSearch,
      changeSort,
      changeIncludeData,
    };
  }),
);
