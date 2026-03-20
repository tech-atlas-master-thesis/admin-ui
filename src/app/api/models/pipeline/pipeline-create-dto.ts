import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';

export interface PipelineCreateDto {
  type: string;
  name: string;
  description: string | null;
  config: UserConfigDto;
}
