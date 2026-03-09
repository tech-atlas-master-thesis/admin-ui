import { StatusDto } from './status-dto';
import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface PipelineDto {
  id: number;
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
  state: StatusDto;
}
