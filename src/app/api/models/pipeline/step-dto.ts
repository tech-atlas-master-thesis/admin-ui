import { StatusDto } from './status-dto';
import { StepResultDto } from '@api/models/pipeline/step-result-dto';

export interface StepDto {
  id: number;
  name: string;
  displayName?: string;
  state: StatusDto;
  events: string[];

  result: StepResultDto;
}
