import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { ScraperApi } from '../../api/scraper-api/scraper-api';
import { firstValueFrom, tap } from 'rxjs';
import { PipelineCreateDto } from '../../api/models/pipeline-create-dto';

export const ScPipelinesStore = signalStore(
  withState({
    reload: 0,
  }),
  withProps(() => ({
    _scraperApi: inject(ScraperApi),
  })),
  withProps((store) => ({
    _pipelinesResource: resource({
      params: store.reload,
      loader: () => firstValueFrom(store._scraperApi.getPipelines()),
    }),
    _pipelineTypeResource: resource({
      loader: () => firstValueFrom(store._scraperApi.getPipelineTypes()),
    }),
  })),
  withComputed((store) => ({
    pipelines: computed(() => store._pipelinesResource.value()),
    error: computed(() => store._pipelinesResource.error()),
    loading: computed(() => store._pipelinesResource.isLoading()),
    pipelineTypes: computed(() => store._pipelineTypeResource.value()),
  })),
  withMethods((store) => {
    function reload() {
      patchState(store, { reload: store.reload() + 1 });
    }

    function createPipeline$(pipeline: PipelineCreateDto) {
      return store._scraperApi.createPipeline({ name: pipeline.name, config: {} }).pipe(tap(() => reload()));
    }

    return {
      reload,
      createPipeline$,
    };
  }),
);
