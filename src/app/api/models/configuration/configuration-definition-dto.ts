import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface ConfigurationDefinitionDto {
  type: string;
  name: LocalisedStringDto;
  description?: LocalisedStringDto;
}
