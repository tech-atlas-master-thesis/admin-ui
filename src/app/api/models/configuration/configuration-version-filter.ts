import { FilterMetadata } from '@openng/optimus-ui/api';

export interface ConfigurationVersionFilter extends Record<string, FilterMetadata[] | undefined> {
  name?: FilterMetadata[];
  state?: FilterMetadata[];
}
