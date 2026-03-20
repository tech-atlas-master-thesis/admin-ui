import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { PipelineDto } from '../models/pipeline/pipeline-dto';
import { StepDto } from '../models/pipeline/step-dto';
import { PipelineCreateDto } from '../models/pipeline/pipeline-create-dto';
import { PipelineConfigDto } from '../models/pipeline/pipeline-config-dto';
import { API_BASE_URL } from '@api/pipeline-api/pipeline-api.token';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';
import { PaginatorState } from 'primeng/paginator';
import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { PaginatedListDto } from '@api/models/paginated-list-dto';
import { TableConstants } from '@shared/contants/table.constants';
import { SortMeta } from 'primeng/api';
import { SortUtil } from '@shared/util/sort';
import { FilterUtil } from '@shared/util/filter';

export class PipelineApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  getPipelines(pagination: PaginatorState, filter: PipelineFilterDto, sort: SortMeta[]) {
    console.log(filter, sort);
    return this.get<PaginatedListDto<PipelineDto>>('/pipelines', {
      params: {
        sort: SortUtil.getSortString(sort),
        ...FilterUtil.getFilter(filter),
        offset: pagination.first ?? TableConstants.INITIAL_OFFSET,
        limit: pagination.rows ?? TableConstants.INITIAL_LIMIT,
      },
    });
  }

  getPipeline(pipelineId: string) {
    return this.get<PipelineDto>(`/pipelines/${pipelineId}`);
  }

  getSteps(pipelineId: string) {
    return this.get<StepDto[]>(`/pipelines/${pipelineId}/steps`);
  }

  getStepResultFilePath(pipelineId: string, stepId: string) {
    return `${this.baseUrl}/pipelines/${pipelineId}/steps/${stepId}/result`;
  }

  createPipeline(pipelineConfig: PipelineCreateDto) {
    return this.post<PipelineDto>(`/pipelines`, pipelineConfig);
  }

  getPipelineTypes() {
    return this.get<PipelineConfigDto[]>('/config/pipeline-types');
  }

  getPipelineTypeConfigDefinition(pipelineType: string) {
    return this.get<StepConfigDto[]>(`/config/pipeline-types/${pipelineType}`);
  }
}
