import { FilterMetadata } from 'primeng/api';

export interface DatasetObjectsFilterDto extends Record<string, FilterMetadata[] | undefined> {
  search?: FilterMetadata[];
}
