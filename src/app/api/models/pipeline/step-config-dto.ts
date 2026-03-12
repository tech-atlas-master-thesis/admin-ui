import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';

export interface StepConfigDto {
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
  userConfig?: UserConfigDefinitionDto[];
}
