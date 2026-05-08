import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { ConfigurationApi } from '@api/service/configuration-api';
import { ConfigurationDto } from '@api/models/configuration/configuration-dto';
import { ConfigurationsStore } from '../configurations.store';

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

    function updateConfiguration$(configuration: ConfigurationDto) {
      const configurationId = store.configurationId();
      if (configurationId === undefined) {
        return of(undefined);
      }
      return store._configurationApi
        .updateConfiguration(configurationId, configuration)
        .pipe(tap(() => store._configurationsStore.reload()));
    }

    return {
      setConfigurationId,
      updateConfiguration$,
    };
  }),
);
