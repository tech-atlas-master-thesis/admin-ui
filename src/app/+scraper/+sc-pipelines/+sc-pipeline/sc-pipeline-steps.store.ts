import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { ScraperApi } from '../../../api/scraper-api/scraper-api';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StepDto } from '../../../api/models/step-dto';

interface ScPipelineStepsStoreState {
  pipelineId: number | undefined;
}

export const ScPipelineStepsStore = signalStore(
  withState<ScPipelineStepsStoreState>({
    pipelineId: undefined,
  }),
  withProps(() => ({
    _scraperApi: inject(ScraperApi),
    _activatedRoute: inject(ActivatedRoute),
    _router: inject(Router),
  })),
  withProps((store) => ({
    _stepsResource: resource({
      params: store.pipelineId,
      loader: (pipelineId) =>
        firstValueFrom(pipelineId.params !== undefined ? store._scraperApi.getSteps(pipelineId.params) : of(undefined)),
    }),
    _queryParams: toSignal(store._activatedRoute.queryParamMap),
  })),
  withComputed((store) => ({
    steps: computed(() => store._stepsResource.value()),
    error: computed(() => store._stepsResource.error()),
    loading: computed(() => store._stepsResource.isLoading()),
    step: computed(() => store._queryParams()?.get('step')),
  })),
  withComputed((store) => ({
    selectedStep: computed(() => {
      const steps = store.steps();
      const step = store.step();
      return steps?.find((s) => s.name === step);
    }),
  })),
  withMethods((store) => {
    function setPipelineId(pipelineId?: number) {
      patchState(store, { pipelineId });
    }

    function selectStep(step: StepDto) {
      store._router.navigate([], {
        relativeTo: store._activatedRoute,
        queryParams: { step: step.name },
        queryParamsHandling: 'merge',
      });
    }

    return {
      selectStep,
      setPipelineId,
    };
  }),
);
