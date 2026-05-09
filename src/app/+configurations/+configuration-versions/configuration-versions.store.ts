import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, of, tap } from 'rxjs';
import { TableConstants } from '@shared/contants/table.constants';
import { PaginatorState } from 'primeng/paginator';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { SortUtil } from '@shared/util/sort';
import { ConfigurationApi } from '@api/service/configuration-api';
import { CreateConfigurationDto } from '@api/models/configuration/create-configuration-dto';
import { ConfigurationVersionFilter } from '@api/models/configuration/configuration-version-filter';
import { ConfigurationStore } from './configuration.store';

interface ConfigurationVersionsStoreState {
  pagination: PaginatorState;
  filter: ConfigurationVersionFilter;
  sort: SortMeta[];
}

export const ConfigurationVersionsStore = signalStore(
  withState<ConfigurationVersionsStoreState>({
    pagination: TableConstants.INITIAL_STATE,
    filter: {
      name: [],
      state: [],
    },
    sort: [{ field: '_id', order: -1 }],
  }),
  withProps(() => ({
    _configurationApi: inject(ConfigurationApi),
    _configurationStore: inject(ConfigurationStore),
  })),
  withProps((store) => ({
    _configurationsResource: resource({
      params: () => ({
        configurationId: store._configurationStore.configurationId(),
        pagination: store.pagination(),
        filter: store.filter(),
        sort: store.sort(),
      }),
      loader: ({ params: { configurationId, pagination, sort, filter } }) =>
        firstValueFrom(
          configurationId
            ? store._configurationApi.getConfigurationVersions(configurationId, pagination, filter, sort)
            : of(),
        ),
    }),
  })),
  withComputed((store) => ({
    versions: computed(() => store._configurationsResource.value()?.items),
    totalItems: computed(() => store._configurationsResource.value()?.page.totalRecords),
    filterCleaned: computed<Record<string, FilterMetadata[]>>(
      () =>
        Object.fromEntries(
          Object.entries(store.filter()).filter(
            ([_, value]) => value !== undefined && Array.isArray(value) && value.length > 0,
          ),
        ) as Record<string, FilterMetadata[]>,
    ),
    error: computed(() => store._configurationsResource.error()),
    loading: computed(() => store._configurationsResource.isLoading()),
  })),
  withMethods((store) => {
    function reload() {
      store._configurationsResource.reload();
    }

    function createVersion$(configurationId: string, configuration: CreateConfigurationDto) {
      return store._configurationApi
        .createConfigurationVersion(configurationId, configuration)
        .pipe(tap(() => reload()));
    }

    function changePage(pagination: PaginatorState) {
      patchState(store, { pagination });
    }

    function changeFilter(filter?: ConfigurationVersionFilter) {
      patchState(store, { filter });
    }

    function changeSort(sort: object) {
      if (!SortUtil.isMultiSort(sort)) {
        return;
      }
      patchState(store, { sort: sort.multisortmeta });
    }

    return {
      reload,
      createVersion$,
      changePage,
      changeFilter,
      changeSort,
    };
  }),
);
