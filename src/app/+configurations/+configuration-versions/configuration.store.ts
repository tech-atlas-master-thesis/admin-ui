import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
import { ConfigurationApi } from '@api/service/configuration-api';
import { ConfigurationsStore } from '../configurations.store';
import { UpdateConfigurationDto } from '@api/models/configuration/update-configuration-dto';

interface ConfigurationStoreState {
  configurationId: string | undefined;
}

export const ConfigurationStore = signalStore(
  withState<ConfigurationStoreState>({
    configurationId: undefined,
  }),
  withProps(() => ({
    _configurationApi: inject(ConfigurationApi),
    _configurationsStore: inject(ConfigurationsStore),
  })),
  withProps((store) => ({
    _configurationResource: resource({
      params: store.configurationId,
      loader: (params) =>
        firstValueFrom(
          params.params !== undefined ? store._configurationApi.getConfiguration(params.params) : of(undefined),
        ),
    }),
  })),
  withComputed((store) => ({
    configuration: computed(() => store._configurationResource.value()),
    error: computed(() => store._configurationResource.error()),
    loading: computed(() => store._configurationResource.isLoading()),
  })),
  withMethods((store) => {
    function setConfigurationId(configurationId?: string) {
      patchState(store, { configurationId });
    }

    function updateConfiguration$(
      configuration: UpdateConfigurationDto,
    ): Observable<UpdateConfigurationDto | undefined> {
      const configurationId = store.configurationId();
      if (configurationId === undefined) {
        return of(undefined);
      }
      return store._configurationApi.updateConfiguration(configurationId, configuration).pipe(
        tap((value) => {
          store._configurationsStore.reload();
          store._configurationResource.set(value);
        }),
      );
    }

    return {
      setConfigurationId,
      updateConfiguration$,
    };
  }),
);
