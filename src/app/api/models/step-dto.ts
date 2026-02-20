import { StatusDto } from './status-dto';

export interface StepDto {
  id: number;
  name: string;
  displayName?: string;
  state: StatusDto;
  events: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}
