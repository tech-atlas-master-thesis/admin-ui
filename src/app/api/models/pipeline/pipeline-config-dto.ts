import { StepConfigDto } from './step-config-dto';

export interface PipelineConfigDto {
  name: string;
  displayName?: string;
  steps: StepConfigDto[];
}
