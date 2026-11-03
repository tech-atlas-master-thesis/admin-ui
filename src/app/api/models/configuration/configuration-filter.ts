import { FilterMetadata } from '@openng/optimus-ui/api';

export interface ConfigurationFilter extends Record<string, FilterMetadata[] | undefined> {
  name?: FilterMetadata[];
  type?: FilterMetadata[];
}
