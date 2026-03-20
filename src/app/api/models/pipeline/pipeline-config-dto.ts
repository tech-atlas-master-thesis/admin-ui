import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface PipelineConfigDto {
  type: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
}
