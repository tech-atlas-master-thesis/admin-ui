import { FilterMetadata } from 'primeng/api';

export interface ConfigurationFilter extends Record<string, FilterMetadata[] | undefined> {
  name?: FilterMetadata[];
  type?: FilterMetadata[];
}
