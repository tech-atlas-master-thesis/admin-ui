import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { UserConfigTypeDto } from '@api/models/pipeline/user-config/user-config-type-dto';
import { UserConfigValueDto } from '@api/models/pipeline/user-config/user-config-value-dto';
import { UserConfigEnumDto } from '@api/models/pipeline/user-config/user-config-enum-dto';

export interface UserConfigDefinitionDto {
  name: string;
  displayName: LocalisedStringDto;
  type: UserConfigTypeDto;
  defaultValue?: UserConfigValueDto;
  enumValues?: UserConfigEnumDto[];
}
