import { StateDto } from './state-dto';
import { StepResultDto } from '@api/models/pipeline/step-result-dto';
import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { StepEventDto } from '@api/models/pipeline/step-event-dto';

export interface StepDto {
  id: string;
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
  state: StateDto;
  events: StepEventDto[];
  result: StepResultDto;
}
