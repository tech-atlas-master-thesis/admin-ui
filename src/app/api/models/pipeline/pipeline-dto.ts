import { StatusDto } from './status-dto';
import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface PipelineDto {
  id: string;
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
  state: StatusDto;
}
