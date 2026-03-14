import { LocalisedStringDto } from '@api/models/localised-string-dto';

export interface UserConfigEnumDto {
  name: string;
  displayName: LocalisedStringDto;
  description: LocalisedStringDto;
}
