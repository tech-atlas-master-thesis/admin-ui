import { LocalisedString } from '@api/models/localisedString';

export interface StepConfigDto {
  name: string;
  displayName?: LocalisedString;
  description?: LocalisedString;
}
