import { FilterMetadata } from '@openng/optimus-ui/api';

export interface DatasetsFilterDto extends Record<string, FilterMetadata[] | undefined> {
  pipelineType?: FilterMetadata[];
  pipelineName?: FilterMetadata[];
}
