import { StatusDto } from './status-dto';
import { LocalisedString } from '@api/models/localisedString';

export interface PipelineDto {
  id: number;
  name: string;
  displayName?: LocalisedString;
  description?: LocalisedString;
  state: StatusDto;
}
