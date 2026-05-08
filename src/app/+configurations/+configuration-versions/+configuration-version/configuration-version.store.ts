import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { ConfigurationApi } from '@api/service/configuration-api';
import { ConfigurationStore } from '../configuration.store';
import { ConfigurationVersionDto } from '@api/models/configuration/configuration-version-dto';
import { ConfigurationVersionsStore } from '../configuration-versions.store';

interface ConfigurationVersionStoreState {
  versionId: string | undefined;
}

export const ConfigurationVersionStore = signalStore(
  withState<ConfigurationVersionStoreState>({
    versionId: undefined,
  }),
  withProps(() => ({
    _configurationApi: inject(ConfigurationApi),
    _configurationStore: inject(ConfigurationStore),
    _versionsStore: inject(ConfigurationVersionsStore),
  })),
  withComputed((store) => ({
    _configurationId: computed(() => store._configurationStore.configurationId()),
  })),
  withProps((store) => ({
    _configurationResource: resource({
      params: () => ({ configurationId: store._configurationId(), versionId: store.versionId() }),
      loader: ({ params: { configurationId, versionId } }) =>
        firstValueFrom(
          configurationId !== undefined && versionId !== undefined
            ? store._configurationApi.getConfigurationVersion(configurationId, versionId)
            : of(undefined),
        ),
    }),
  })),
  withComputed((store) => ({
    configuration: computed(() => store._configurationResource.value()),
    error: computed(() => store._configurationResource.error()),
    loading: computed(() => store._configurationResource.isLoading()),
  })),
  withMethods((store) => {
    function setVersionId(versionId?: string) {
      patchState(store, { versionId });
    }

    function updateVersion$(version: ConfigurationVersionDto) {
      const configurationId = store._configurationId();
      const versionId = store.versionId();
      if (configurationId === undefined || versionId === undefined) {
        return of(undefined);
      }
      return store._configurationApi
        .updateConfigurationVersion(configurationId, versionId, version)
        .pipe(tap(() => store._versionsStore.reload()));
    }

    return {
      setVersionId,
      updateVersion$,
    };
  }),
);
