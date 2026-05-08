import { Api } from '@api/api';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@api/service/api-base-url.token';
import { PaginatorState } from 'primeng/paginator';
import { SortMeta } from 'primeng/api';
import { FilterUtil } from '@shared/util/filter';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { SortUtil } from '@shared/util/sort';
import { TableConstants } from '@shared/contants/table.constants';
import { ConfigurationDto } from '@api/models/configuration/configuration-dto';
import { CreateConfigurationDto } from '@api/models/configuration/create-configuration-dto';
import { ConfigurationFilter } from '@api/models/configuration/configuration-filter';
import { ConfigurationVersionFilter } from '@api/models/configuration/configuration-version-filter';
import { ConfigurationVersionDto } from '@api/models/configuration/configuration-version-dto';
import { ConfigurationDefinitionDto } from '@api/models/configuration/configuration-definition-dto';

export class ConfigurationApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  getConfigurationTypes() {
    return this.get<ConfigurationDefinitionDto[]>('/configuration-types');
  }

  getConfigurations(
    pagination: PaginatorState,
    filter: ConfigurationFilter,
    sort: SortMeta[],
    allowedTypes?: string[],
  ) {
    const filterObject = FilterUtil.getFilter(filter) as Record<string, unknown>;
    if (
      allowedTypes &&
      (!('type' in filterObject) || (Array.isArray(filterObject['type']) && filterObject['type'].length < 1))
    ) {
      filterObject['type'] = allowedTypes;
    }
    return this.get<PaginatedListDto<ConfigurationDto>>('/configuration', {
      params: {
        sort: SortUtil.getSortString(sort),
        ...filterObject,
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  createConfiguration(create: CreateConfigurationDto) {
    return this.post<ConfigurationDto>('/configuration', create);
  }

  getConfiguration(configurationId: string) {
    return this.get<ConfigurationDto>(`/datasets/${configurationId}`);
  }

  updateConfiguration(configurationId: string, configuration: ConfigurationDto) {
    return this.post<ConfigurationDto>(`/datasets/${configurationId}`, configuration);
  }

  getConfigurationVersions(
    configurationId: string,
    pagination: PaginatorState,
    filter: ConfigurationVersionFilter,
    sort: SortMeta[],
  ) {
    const filterObject = FilterUtil.getFilter(filter) as Record<string, unknown>;
    return this.get<PaginatedListDto<ConfigurationVersionDto>>(`/configuration/${configurationId}/version`, {
      params: {
        sort: SortUtil.getSortString(sort),
        ...filterObject,
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  createConfigurationVersion(configurationId: string, create: CreateConfigurationDto) {
    return this.post<ConfigurationVersionDto>(`/configuration/${configurationId}/version`, create);
  }

  getConfigurationVersion(configurationId: string, versionId: string) {
    return this.get<ConfigurationVersionDto>(`/configuration/${configurationId}/version/${versionId}`);
  }

  updateConfigurationVersion(configurationId: string, versionId: string, version: ConfigurationVersionDto) {
    return this.post<ConfigurationVersionDto>(`/configuration/${configurationId}/version/${versionId}`, version);
  }
}
