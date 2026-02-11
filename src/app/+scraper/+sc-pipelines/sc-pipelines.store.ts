import { signalStore, withComputed, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { ScraperApi } from '../../api/scraper-api/scraper-api';
import { firstValueFrom } from 'rxjs';

export const ScPipelinesStore = signalStore(
  withState({}),
  withProps(() => ({
    _scraperApi: inject(ScraperApi),
  })),
  withProps((store) => ({
    _pipelinesResource: resource({
      loader: () => firstValueFrom(store._scraperApi.getPipelines()),
    }),
  })),
  withComputed((store) => ({
    pipelines: computed(() => store._pipelinesResource.value()),
    error: computed(() => store._pipelinesResource.error()),
    loading: computed(() => store._pipelinesResource.isLoading()),
  })),
);
