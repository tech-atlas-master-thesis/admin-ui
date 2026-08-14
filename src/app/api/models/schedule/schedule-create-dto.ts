import { PipelineCreateDto } from '@api/models/pipeline/pipeline-create-dto';

export interface ScheduleCreateDto {
  pipeline: PipelineCreateDto;
  active: boolean;
  cron?: string;
}
