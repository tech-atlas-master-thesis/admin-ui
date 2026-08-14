import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { SchedulesApi } from '@api/service/schedules-api';
import { ScheduleCreateDto } from '@api/models/schedule/schedule-create-dto';

interface ScheduleStoreState {
  scheduleId: string | undefined;
}

export const ScheduleStore = signalStore(
  withState<ScheduleStoreState>({
    scheduleId: undefined,
  }),
  withProps(() => ({
    _schedulesApi: inject(SchedulesApi),
  })),
  withProps((store) => ({
    _scheduleResource: resource({
      params: store.scheduleId,
      loader: (pipelineId) =>
        firstValueFrom(
          pipelineId.params !== undefined ? store._schedulesApi.getSchedule(pipelineId.params) : of(undefined),
        ),
    }),
  })),
  withComputed((store) => ({
    schedule: computed(() => store._scheduleResource.value()),
    error: computed(() => store._scheduleResource.error()),
    loading: computed(() => store._scheduleResource.isLoading()),
  })),
  withMethods((store) => {
    function reload() {
      store._scheduleResource.reload();
    }

    function setScheduleId(scheduleId?: string) {
      patchState(store, { scheduleId: scheduleId ?? undefined });
    }

    function updateSchedule$(id: string, schedule: ScheduleCreateDto) {
      return store._schedulesApi.updateSchedule(id, schedule).pipe(tap(() => reload()));
    }

    return {
      reload,
      setScheduleId,
      updateSchedule$,
    };
  }),
);
