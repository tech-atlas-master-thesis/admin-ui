import { inject, Injectable } from '@angular/core';
import { Api } from '../api';
import { HttpClient } from '@angular/common/http';
import environment from '../../../environment/environment';
import { PipelineDto } from '../models/pipeline-dto';
import { StepDto } from '../models/step-dto';
import { PipelineCreateDto } from '../models/pipeline-create-dto';
import { PipelineConfigDto } from '../models/pipeline-config-dto';

@Injectable({
  providedIn: 'root',
})
export class ScraperApi extends Api {
  protected readonly httpClient = inject(HttpClient);
  protected readonly baseUrl = environment.baseUrl + '/api/scraper';

  getPipelines() {
    return this.get<PipelineDto[]>('/pipelines');
  }

  getPipeline(pipelineId: number) {
    return this.get<PipelineDto>(`/pipelines/${pipelineId}`);
  }

  getSteps(pipelineId: number) {
    return this.get<StepDto[]>(`/pipelines/${pipelineId}/steps`);
  }

  createPipeline(pipelineConfig: PipelineCreateDto) {
    return this.post<PipelineDto>(`/pipelines`, pipelineConfig);
  }

  getPipelineTypes() {
    return this.get<PipelineConfigDto[]>('/config/pipeline-types');
  }
}
