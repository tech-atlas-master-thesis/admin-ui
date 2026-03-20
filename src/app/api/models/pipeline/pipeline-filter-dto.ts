import { FilterMetadata } from 'primeng/api';

export interface PipelineFilterDto extends Record<string, FilterMetadata[] | undefined> {
  name?: FilterMetadata[];
  type?: FilterMetadata[];
  state?: FilterMetadata[];
  createdBy?: FilterMetadata[];
  createdAt?: FilterMetadata[];
}
