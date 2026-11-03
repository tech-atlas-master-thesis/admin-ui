import { signalStore, withComputed, withHooks, withMethods, withProps } from '@ngrx/signals';
import { computed, inject, linkedSignal, resource } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom, fromEvent, interval, merge } from 'rxjs';
import { DashboardApi } from '@api/service/dashboard-api';
import { DashboardDto } from '@api/models/dashboard/dashboard-dto';

const REFRESH_INTERVAL_MS = 30_000;

export const DashboardStore = signalStore(
  withProps(() => ({
    _dashboardApi: inject(DashboardApi),
  })),
  withProps((store) => ({
    _dashboardResource: resource({
      loader: () => firstValueFrom(store._dashboardApi.getDashboard()),
    }),
  })),
  withProps((store) => ({
    // Keeps the last successful response on screen when a refresh fails
    dashboard: linkedSignal<DashboardDto | undefined, DashboardDto | undefined>({
      source: () => (store._dashboardResource.hasValue() ? store._dashboardResource.value() : undefined),
      computation: (dashboard, previous) => dashboard ?? previous?.value,
    }),
  })),
  withComputed((store) => ({
    error: computed(() => store._dashboardResource.error()),
    initialLoading: computed(() => store._dashboardResource.isLoading() && !store.dashboard()),
  })),
  withMethods((store) => {
    function reload() {
      store._dashboardResource.reload();
    }

    return {
      reload,
    };
  }),
  withHooks((store) => ({
    onInit() {
      // Polling pauses after a failure, as the error interceptor shows a toast for every failed request
      merge(
        interval(REFRESH_INTERVAL_MS).pipe(filter(() => !document.hidden && !store.error())),
        fromEvent(document, 'visibilitychange').pipe(filter(() => !document.hidden)),
      )
        .pipe(takeUntilDestroyed())
        .subscribe(() => store.reload());
    },
  })),
);
