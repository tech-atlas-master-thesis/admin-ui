import { AuditInfoDto } from '@api/models/audit-info-dto';
import { ConfigurationStateDto } from '@api/models/configuration/configuration-state-dto';

export interface ConfigurationVersionDto {
  id: string;
  collection: string;
  version: string;
  name?: string;
  description?: string;
  state: ConfigurationStateDto;
  configuration: object;
  created: AuditInfoDto;
  modified?: AuditInfoDto;
}
