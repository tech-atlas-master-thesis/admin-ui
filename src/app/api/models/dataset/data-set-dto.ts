import { AuditInfoDto } from '@api/models/audit-info-dto';

export interface DataSetDto {
  id: string;
  pipelineType: string;
  pipelineName: string;
  pipeline: string;
  active: boolean;
  created: AuditInfoDto;
}
