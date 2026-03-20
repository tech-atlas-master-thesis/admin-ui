import { PipelineFilterDto } from '@api/models/pipeline/pipeline-filter-dto';
import { SortOrder } from '@shared/util/sort';

export interface PipelineSortDto {
  key: keyof PipelineFilterDto;
  order: SortOrder;
}
