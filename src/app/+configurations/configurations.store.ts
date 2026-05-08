import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject, resource } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { TableConstants } from '@shared/contants/table.constants';
import { PaginatorState } from 'primeng/paginator';
import { FilterMetadata, SortMeta } from 'primeng/api';
import { SortUtil } from '@shared/util/sort';
import { ConfigurationFilter } from '@api/models/configuration/configuration-filter';
import { ConfigurationApi } from '@api/service/configuration-api';
import { CreateConfigurationDto } from '@api/models/configuration/create-configuration-dto';

interface ConfigurationsStoreState {
  pagination: PaginatorState;
  filter: ConfigurationFilter;
  sort: SortMeta[];
}

export const ConfigurationsStore = signalStore(
  withState<ConfigurationsStoreState>({
    pagination: TableConstants.INITIAL_STATE,
    filter: {
      name: [],
      type: [],
    },
    sort: [{ field: '_id', order: -1 }],
  }),
  withProps(() => ({
    _configurationApi: inject(ConfigurationApi),
  })),
  withProps((store) => ({
    _configurationTypesResource: resource({
      // TODO
      loader: () => firstValueFrom(store._configurationApi.getConfigurationTypes()),
    }),
  })),
  withComputed((store) => ({
    configurationTypes: computed(() => store._configurationTypesResource.value()),
  })),
  withProps((store) => ({
    _configurationsResource: resource({
      params: () => ({
        pagination: store.pagination(),
        filter: store.filter(),
        sort: store.sort(),
        allowedTypes: store.configurationTypes()?.map((type) => type.type),
      }),
      loader: ({ params: { pagination, sort, filter, allowedTypes } }) =>
        firstValueFrom(store._configurationApi.getConfigurations(pagination, filter, sort, allowedTypes)),
    }),
  })),
  withComputed((store) => ({
    configurations: computed(() => store._configurationsResource.value()?.items),
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

    function createPipeline$(configuration: CreateConfigurationDto) {
      return store._configurationApi.createConfiguration(configuration).pipe(tap(() => reload()));
    }

    function changePage(pagination: PaginatorState) {
      patchState(store, { pagination });
    }

    function changeFilter(filter?: ConfigurationFilter) {
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
      createPipeline$,
      changePage,
      changeFilter,
      changeSort,
    };
  }),
);
