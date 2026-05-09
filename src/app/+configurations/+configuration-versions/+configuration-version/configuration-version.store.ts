import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, Observable, of, tap } from 'rxjs';
import { ConfigurationApi } from '@api/service/configuration-api';
import { ConfigurationStore } from '../configuration.store';
import { ConfigurationVersionDto } from '@api/models/configuration/configuration-version-dto';
import { ConfigurationVersionsStore } from '../configuration-versions.store';
import { UpdateConfigurationVersionDto } from '@api/models/configuration/update-configuration-version-dto';

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
  withProps((store) => ({
    _configurationVersionResource: resource({
      params: () => ({ configurationId: store._configurationStore.configurationId(), versionId: store.versionId() }),
      loader: ({ params: { configurationId, versionId } }) =>
        firstValueFrom(
          configurationId !== undefined && versionId !== undefined
            ? store._configurationApi.getConfigurationVersion(configurationId, versionId)
            : of(undefined),
        ),
    }),
  })),
  withComputed((store) => ({
    version: computed(() => store._configurationVersionResource.value()),
    error: computed(() => store._configurationVersionResource.error()),
    loading: computed(() => store._configurationVersionResource.isLoading()),
  })),
  withMethods((store) => {
    function setVersionId(versionId?: string) {
      patchState(store, { versionId });
    }

    function updateVersion$(version: UpdateConfigurationVersionDto): Observable<ConfigurationVersionDto | undefined> {
      const configurationId = store._configurationStore.configurationId();
      const versionId = store.versionId();
      if (configurationId === undefined || versionId === undefined) {
        return of(undefined);
      }
      return store._configurationApi.updateConfigurationVersion(configurationId, versionId, version).pipe(
        tap((value) => {
          store._versionsStore.reload();
          store._configurationVersionResource.set(value);
        }),
      );
    }

    return {
      setVersionId,
      updateVersion$,
    };
  }),
);
