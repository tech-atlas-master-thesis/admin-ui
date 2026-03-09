import { StatusDto } from './status-dto';
import { StepResultDto } from '@api/models/pipeline/step-result-dto';
import { LocalisedStringDto } from '@api/models/localised-string-dto';
import { StepEventDto } from '@api/models/pipeline/step-event-dto';

export interface StepDto {
  id: number;
  name: string;
  displayName?: LocalisedStringDto;
  description?: LocalisedStringDto;
  state: StatusDto;
  events: StepEventDto[];
  result: StepResultDto;
}
