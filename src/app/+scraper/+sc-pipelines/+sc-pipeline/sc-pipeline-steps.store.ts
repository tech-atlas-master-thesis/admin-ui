import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { ScraperApi } from '../../../api/scraper-api/scraper-api';

interface ScPipelineStepsStoreState {
  pipelineId: number | undefined;
}

export const ScPipelineStepsStore = signalStore(
  withState<ScPipelineStepsStoreState>({
    pipelineId: undefined,
  }),
  withProps(() => ({
    _scraperApi: inject(ScraperApi),
  })),
  withProps((store) => ({
    _stepsResource: resource({
      params: store.pipelineId,
      loader: (pipelineId) =>
        firstValueFrom(pipelineId.params ? store._scraperApi.getSteps(pipelineId.params) : of(undefined)),
    }),
  })),
  withComputed((store) => ({
    steps: computed(() => store._stepsResource.value()),
    error: computed(() => store._stepsResource.error()),
    loading: computed(() => store._stepsResource.isLoading()),
  })),
  withMethods((store) => {
    function setPipelineId(pipelineId?: number) {
      patchState(store, { pipelineId });
    }

    return {
      setPipelineId,
    };
  }),
);
