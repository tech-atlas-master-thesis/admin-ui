import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface StepConfigDto {
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
}
