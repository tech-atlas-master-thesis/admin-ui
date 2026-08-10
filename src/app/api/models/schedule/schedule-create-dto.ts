import { PipelineCreateDto } from '@api/models/pipeline/pipeline-create-dto';

export interface ScheduleCreateDto extends PipelineCreateDto {
  active: boolean;
  cron?: string;
}
