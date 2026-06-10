import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';
import { AuditInfoDto } from '@api/models/audit-info-dto';

export interface ScheduleDto {
  id: string;
  name: string;
  type: string;
  description: string;
  active: boolean;
  cron?: string;
  config?: UserConfigDto;
  created: AuditInfoDto;
  modified?: AuditInfoDto;
  lastExecution?: Date;
  lastPipeline?: string;
}
