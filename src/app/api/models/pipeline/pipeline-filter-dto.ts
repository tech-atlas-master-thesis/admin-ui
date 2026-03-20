import { DateTimeFilter } from '@shared/util/filter';

export interface PipelineFilterDto {
  name?: string;
  type?: string[];
  state?: string[];
  createdBy?: string[];
  createdAt?: DateTimeFilter;
}
