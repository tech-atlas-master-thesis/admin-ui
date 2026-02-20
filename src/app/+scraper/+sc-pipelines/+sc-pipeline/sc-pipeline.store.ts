import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { ScraperApi } from '../../../api/scraper-api/scraper-api';

interface ScPipelineStoreState {
  pipelineId: number | undefined;
}

export const ScPipelineStore = signalStore(
  withState<ScPipelineStoreState>({
    pipelineId: undefined,
  }),
  withProps(() => ({
    _scraperApi: inject(ScraperApi),
  })),
  withProps((store) => ({
    _pipelineResource: resource({
      params: store.pipelineId,
      loader: (pipelineId) =>
        firstValueFrom(
          pipelineId.params !== undefined ? store._scraperApi.getPipeline(pipelineId.params) : of(undefined),
        ),
    }),
    _pipelineStepsResource: resource({
      params: store.pipelineId,
      loader: (pipelineId) =>
        firstValueFrom(pipelineId.params !== undefined ? store._scraperApi.getSteps(pipelineId.params) : of(undefined)),
    }),
  })),
  withComputed((store) => ({
    pipeline: computed(() => store._pipelineResource.value()),
    error: computed(() => store._pipelineResource.error()),
    loading: computed(() => store._pipelineResource.isLoading()),
  })),
  withMethods((store) => {
    function setPipelineId(pipelineId?: number) {
      patchState(store, { pipelineId: pipelineId ?? undefined });
    }

    return {
      setPipelineId,
    };
  }),
);
