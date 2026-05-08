import { AuditInfoDto } from '@api/models/audit-info-dto';

export interface ConfigurationDto {
  id: string;
  type: string;
  name?: string;
  description?: string;
  created: AuditInfoDto;
  modified?: AuditInfoDto;
}
