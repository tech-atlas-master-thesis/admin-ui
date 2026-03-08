import { StatusDto } from './status-dto';
import { StepResultDto } from '@api/models/pipeline/step-result-dto';
import { LocalisedString } from '@api/models/localisedString';

export interface StepDto {
  id: number;
  name: string;
  displayName?: LocalisedString;
  description?: LocalisedString;
  state: StatusDto;
  events: string[];

  result: StepResultDto;
}
