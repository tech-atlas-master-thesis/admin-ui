import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface PipelineConfigDto {
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
}
