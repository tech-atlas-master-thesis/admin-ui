import { StatusDto } from './status-dto';

export interface PipelineDto {
  id: number;
  name: string;
  displayName: string;
  state: StatusDto;
}
