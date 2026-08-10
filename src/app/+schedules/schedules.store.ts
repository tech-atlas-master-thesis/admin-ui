import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { TableConstants } from '@shared/contants/table.constants';
import { PaginatorState } from 'primeng/paginator';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { SortUtil } from '@shared/util/sort';
import { SchedulesApi } from '@api/service/schedules-api';
import { PipelinesStore } from '../+pipelines/pipelines.store';
import { ScheduleCreateDto } from '@api/models/schedule/schedule-create-dto';

interface SchedulesStoreState {
  pagination: PaginatorState;
  filter: PipelineFilterDto;
  sort: SortMeta[];
}

export const SchedulesStore = signalStore(
  withState<SchedulesStoreState>({
    pagination: TableConstants.INITIAL_STATE,
    filter: {
      name: [],
      type: [],
      state: [],
      createdBy: [],
      createdAt: [],
    },
    sort: [{ field: '_id', order: -1 }],
  }),
  withProps(() => ({
    _schedulesApi: inject(SchedulesApi),
    _pipelinesStore: inject(PipelinesStore),
  })),
  withComputed((store) => ({
    pipelineTypes: computed(() => store._pipelinesStore.pipelineTypes()),
  })),
  withProps((store) => ({
    _schedulesResource: resource({
      params: () => ({
        pagination: store.pagination(),
        filter: store.filter(),
        sort: store.sort(),
        allowedTypes: store.pipelineTypes()?.map((type) => type.type),
      }),
      loader: ({ params: { pagination, sort, filter, allowedTypes } }) =>
        firstValueFrom(store._schedulesApi.getSchedules(pagination, filter, sort, allowedTypes)),
    }),
  })),
  withComputed((store) => ({
    schedules: computed(() => store._schedulesResource.value()?.items),
    totalItems: computed(() => store._schedulesResource.value()?.page.totalRecords),
    filterCleaned: computed<Record<string, FilterMetadata[]>>(
      () =>
        Object.fromEntries(
          Object.entries(store.filter()).filter(
            ([_, value]) => value !== undefined && Array.isArray(value) && value.length > 0,
          ),
        ) as Record<string, FilterMetadata[]>,
    ),
    error: computed(() => store._schedulesResource.error()),
    loading: computed(() => store._schedulesResource.isLoading()),
  })),
  withMethods((store) => {
    function reload() {
      store._schedulesResource.reload();
    }

    function createSchedule$(schedule: ScheduleCreateDto) {
      return store._schedulesApi.createSchedule(schedule).pipe(tap(() => reload()));
    }

    function deleteSchedule$(scheduleId: string) {
      return store._schedulesApi.deleteSchedule(scheduleId).pipe(tap(() => reload()));
    }

    function changePage(pagination: PaginatorState) {
      patchState(store, { pagination });
    }

    function changeFilter(filter?: PipelineFilterDto) {
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
      createSchedule$,
      deleteSchedule$,
      changePage,
      changeFilter,
      changeSort,
    };
  }),
);
