import { FilterMetadata } from '@openng/optimus-ui/api';

export interface DatasetObjectsFilterDto extends Record<string, FilterMetadata[] | undefined> {
  search?: FilterMetadata[];
}
