import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { TransformerApi } from '@api/service/transformer-api';

interface DataSetStoreState {
  dataSetId: string | undefined;
}

export const DataSetStore = signalStore(
  withState<DataSetStoreState>({
    dataSetId: undefined,
  }),
  withProps(() => ({
    _transformerApi: inject(TransformerApi),
  })),
  withProps((store) => ({
    _dataSetResource: resource({
      params: store.dataSetId,
      loader: (dataSetId) =>
        firstValueFrom(
          dataSetId.params !== undefined ? store._transformerApi.getDataSet(dataSetId.params) : of(undefined),
        ),
    }),
  })),
  withComputed((store) => ({
    dataSet: computed(() => store._dataSetResource.value()),
    error: computed(() => store._dataSetResource.error()),
    loading: computed(() => store._dataSetResource.isLoading()),
  })),
  withMethods((store) => {
    function setDataSetId(dataSetId?: string) {
      patchState(store, { dataSetId: dataSetId ?? undefined });
    }

    function exportDataSet$() {
      const dataSetId = store.dataSetId();
      if (!dataSetId) {
        return of(undefined);
      }
      return store._transformerApi.exportDataSetFull(dataSetId);
    }

    return {
      setDataSetId,
      exportDataSet$,
    };
  }),
);
