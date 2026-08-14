import { AuditInfoDto } from '@api/models/audit-info-dto';
import { PipelineCreateDto } from '@api/models/pipeline/pipeline-create-dto';

export interface ScheduleDto {
  id: string;
  pipeline: PipelineCreateDto;
  active: boolean;
  cron: string;
  created: AuditInfoDto;
  modified?: AuditInfoDto;
  lastExecution?: Date;
  lastPipeline?: string;
}
