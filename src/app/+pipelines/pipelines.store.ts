import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';
import { firstValueFrom, tap } from 'rxjs';
import { PipelineCreateDto } from '@api/models/pipeline/pipeline-create-dto';
import { TableConstants } from '@shared/contants/table.constants';
import { PaginatorState } from 'primeng/paginator';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { PipelineSortDto } from '@api/models/pipeline/pipeline-sort-dto';
import { FilterMetadata } from 'primeng/api';

interface PipelineStoreState {
  pagination: PaginatorState;
  filter: PipelineFilterDto;
  sort: PipelineSortDto[];
}

export const PipelinesStore = signalStore(
  withState<PipelineStoreState>({
    pagination: TableConstants.INITIAL_STATE,
    filter: {},
    sort: [],
  }),
  withProps(() => ({
    _scraperApi: inject(PipelineApi),
  })),
  withProps((store) => ({
    _pipelinesResource: resource({
      params: () => ({ pagination: store.pagination(), filter: store.filter(), sort: store.sort() }),
      loader: ({ params: { pagination, sort, filter } }) =>
        firstValueFrom(store._scraperApi.getPipelines(pagination, filter, sort)),
    }),
    _pipelineTypeResource: resource({
      loader: () => firstValueFrom(store._scraperApi.getPipelineTypes()),
    }),
  })),
  withComputed((store) => ({
    pipelines: computed(() => store._pipelinesResource.value()?.items),
    totalItems: computed(() => store._pipelinesResource.value()?.page.totalRecords),
    error: computed(() => store._pipelinesResource.error()),
    loading: computed(() => store._pipelinesResource.isLoading()),
    pipelineTypes: computed(() => store._pipelineTypeResource.value()),
  })),
  withMethods((store) => {
    function reload() {
      store._pipelinesResource.reload();
    }

    function createPipeline$(pipeline: PipelineCreateDto) {
      return store._scraperApi.createPipeline(pipeline).pipe(tap(() => reload()));
    }

    function changePage(pagination: PaginatorState) {
      patchState(store, { pagination });
    }

    function changeFilter(filter?: Record<string, FilterMetadata | undefined>) {
      patchState(store, { filter });
    }

    function changeSort(sort: object) {
      patchState(store, { sort: sort as unknown as PipelineSortDto[] });
    }

    return {
      reload,
      createPipeline$,
      changePage,
      changeFilter,
      changeSort,
    };
  }),
);
