import { inject } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import { PipelineDto } from '../models/pipeline/pipeline-dto';
import { StepDto } from '../models/pipeline/step-dto';
import { PipelineCreateDto } from '../models/pipeline/pipeline-create-dto';
import { PipelineConfigDto } from '../models/pipeline/pipeline-config-dto';
import { API_BASE_URL } from '@api/pipeline-api/pipeline-api.token';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';

export class PipelineApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  getPipelines() {
    return this.get<PipelineDto[]>('/pipelines');
  }

  getPipeline(pipelineId: number) {
    return this.get<PipelineDto>(`/pipelines/${pipelineId}`);
  }

  getSteps(pipelineId: number) {
    return this.get<StepDto[]>(`/pipelines/${pipelineId}/steps`);
  }

  getStepResultFilePath(pipelineId: number, stepId: number) {
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
