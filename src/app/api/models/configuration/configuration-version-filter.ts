import { FilterMetadata } from 'primeng/api';

export interface ConfigurationVersionFilter extends Record<string, FilterMetadata[] | undefined> {
  name?: FilterMetadata[];
  state?: FilterMetadata[];
}
