import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { PaginatorState } from 'primeng/paginator';
import { SortMeta } from 'primeng/api';
import { FilterUtil } from '@shared/util/filter';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { SortUtil } from '@shared/util/sort';
import { TableConstants } from '@shared/contants/table.constants';
import { DatasetsFilterDto } from '@api/models/dataset/datasets-filter-dto';
import { DataSetObjectBase } from '@api/models/dataset/data-set-object-base';
import { DataSetDto } from '@api/models/dataset/data-set-dto';
import { DataSetObjectType } from '@api/models/dataset/data-set-object-type';
import environment from '../../../environment/environment';

export class TransformerApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = environment.baseUrl + environment.transformerBaseUrl;

  getDataSets(pagination: PaginatorState, filter: DatasetsFilterDto, sort: SortMeta[]) {
    const filterObject = FilterUtil.getFilter(filter) as Record<string, unknown>;
    return this.get<PaginatedListDto<DataSetDto>>('/datasets', {
      params: {
        sort: SortUtil.getSortString(sort),
        ...filterObject,
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  getDataSet(dataSetId: string) {
    return this.get<DataSetDto>(`/datasets/${dataSetId}`);
  }

  getDataSetObject(
    dataSetId: string,
    object: DataSetObjectType,
    pagination: PaginatorState,
    search: string | undefined,
    sort: SortMeta[] = [],
    includeData?: boolean,
  ) {
    const searchFilter = search !== undefined ? { search } : Object.create(null);
    return this.get<PaginatedListDto<DataSetObjectBase>>(`/datasets/${dataSetId}/${object}`, {
      params: {
        sort: SortUtil.getSortString(sort),
        ...searchFilter,
        includeData: includeData ?? false,
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  exportDataSetFull(dataSetId: string) {
    return this.getFile(`/datasets/${dataSetId}/export`);
  }

  exportDataSetObjects(
    dataSetId: string,
    object: DataSetObjectType,
    search: string | undefined,
    includeData?: boolean,
  ) {
    const searchFilter = search !== undefined ? { search } : Object.create(null);
    return this.getFile(`/datasets/${dataSetId}/${object}/export`, {
      params: {
        ...searchFilter,
        includeData: includeData ?? false,
      },
    });
  }
}
