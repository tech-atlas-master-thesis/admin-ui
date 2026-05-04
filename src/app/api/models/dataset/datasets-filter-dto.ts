import { FilterMetadata } from 'primeng/api';

export interface DatasetsFilterDto extends Record<string, FilterMetadata[] | undefined> {
  pipelineType?: FilterMetadata[];
  pipelineName?: FilterMetadata[];
}
