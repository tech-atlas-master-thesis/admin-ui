import { StateDto } from './state-dto';
import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';
import { AuditInfoDto } from '@api/models/audit-info-dto';

export interface PipelineDto {
  id: string;
  type: string;
  name: string;
  description: string;
  state: StateDto;
  userConfig: UserConfigDto;
  created: AuditInfoDto;
}
