import { UserConfigDto } from '@api/models/pipeline/user-config/user-config-dto';

export interface PipelineCreateDto {
  name: string;
  config: UserConfigDto;
}
