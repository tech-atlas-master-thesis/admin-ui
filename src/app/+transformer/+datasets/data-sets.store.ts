import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TableConstants } from '@shared/contants/table.constants';
import { PaginatorState } from 'primeng/paginator';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { SortUtil } from '@shared/util/sort';
import { DatasetsFilterDto } from '@api/models/dataset/datasets-filter-dto';
import { TransformerApi } from '@api/pipeline-api/transformer-api';

interface DataSetsStoreState {
  pagination: PaginatorState;
  filter: DatasetsFilterDto;
  sort: SortMeta[];
}

export const DataSetsStore = signalStore(
  withState<DataSetsStoreState>({
    pagination: TableConstants.INITIAL_STATE,
    filter: {
      pipelineType: undefined,
      pipelineName: undefined,
    },
    sort: [{ field: '_id', order: -1 }],
  }),
  withProps(() => ({
    _transformerApi: inject(TransformerApi),
  })),
  withProps((store) => ({
    _dataSetsResource: resource({
      params: () => ({
        pagination: store.pagination(),
        filter: store.filter(),
        sort: store.sort(),
      }),
      loader: ({ params: { pagination, sort, filter } }) =>
        firstValueFrom(store._transformerApi.getDataSets(pagination, filter, sort)),
    }),
  })),
  withComputed((store) => ({
    dataSets: computed(() => store._dataSetsResource.value()?.items),
    totalItems: computed(() => store._dataSetsResource.value()?.page.totalRecords),
    filterCleaned: computed<Record<string, FilterMetadata[]>>(
      () =>
        Object.fromEntries(
          Object.entries(store.filter()).filter(
            ([_, value]) => value !== undefined && Array.isArray(value) && value.length > 0,
          ),
        ) as Record<string, FilterMetadata[]>,
    ),
    error: computed(() => store._dataSetsResource.error()),
    loading: computed(() => store._dataSetsResource.isLoading()),
  })),
  withMethods((store) => {
    function reload() {
      store._dataSetsResource.reload();
    }

    function changePage(pagination: PaginatorState) {
      patchState(store, { pagination });
    }

    function changeFilter(filter?: DatasetsFilterDto) {
      patchState(store, { filter });
    }

    function changeSort(sort: object) {
      if (!SortUtil.isMultiSort(sort)) {
        return;
      }
      patchState(store, { sort: sort.multisortmeta });
    }

    return {
      reload,
      changePage,
      changeFilter,
      changeSort,
    };
  }),
);
