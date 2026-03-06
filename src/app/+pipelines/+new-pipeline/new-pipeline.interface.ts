import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';

export interface NewPipelineForm {
  pipelineType: PipelineConfigDto | null;
}
