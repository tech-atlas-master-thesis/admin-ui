import { LocalisedString } from '@api/models/localisedString';

export interface PipelineConfigDto {
  name: string;
  displayName?: LocalisedString;
  description?: LocalisedString;
}
