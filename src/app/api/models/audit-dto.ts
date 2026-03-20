import { AuditInfoDto } from '@api/models/audit-info-dto';

export interface AuditDto {
  created?: AuditInfoDto;
  modified?: AuditInfoDto;
}
