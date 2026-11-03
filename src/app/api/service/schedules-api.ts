import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-base-url.token';
import { PaginatorState } from '@openng/optimus-ui/paginator';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { SortMeta } from '@openng/optimus-ui/api';
import { FilterUtil } from '@shared/util/filter';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { PipelineDto } from '@api/models/pipeline/pipeline-dto';
import { SortUtil } from '@shared/util/sort';
import { TableConstants } from '@shared/contants/table.constants';
import { ScheduleDto } from '@api/models/schedule/schedule-dto';
import { ScheduleCreateDto } from '@api/models/schedule/schedule-create-dto';

export class SchedulesApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  getSchedules(pagination: PaginatorState, filter: PipelineFilterDto, sort: SortMeta[], allowedTypes?: string[]) {
    const filterObject = FilterUtil.getFilter(filter) as Record<string, unknown>;
    if (
      allowedTypes &&
      (!('type' in filterObject) || (Array.isArray(filterObject['type']) && filterObject['type'].length < 1))
    ) {
      filterObject['type'] = allowedTypes;
    }
    return this.get<PaginatedListDto<ScheduleDto>>('/schedules', {
      params: {
        sort: SortUtil.getSortString(sort),
        ...filterObject,
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  getSchedule(pipelineId: string) {
    return this.get<ScheduleDto>(`/schedules/${pipelineId}`);
  }

  createSchedule(pipelineConfig: ScheduleCreateDto) {
    return this.post<PipelineDto>(`/schedules`, pipelineConfig);
  }

  updateSchedule(pipelineId: string, pipelineConfig: ScheduleCreateDto) {
    return this.put<PipelineDto>(`/schedules/${pipelineId}`, pipelineConfig);
  }

  triggerSchedule(pipelineId: string) {
    return this.post<null>(`/schedules/${pipelineId}/trigger`, null);
  }

  deleteSchedule(pipelineId: string) {
    return this.delete<PipelineDto>(`/schedules/${pipelineId}`);
  }
}
