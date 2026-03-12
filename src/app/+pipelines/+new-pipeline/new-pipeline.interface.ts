import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { UserConfigValueDto } from '@api/models/pipeline/user-config/user-config-value-dto';

export interface NewPipelineForm {
  pipelineType: PipelineConfigDto | null;
}

export type PipelineConfigForm = FormGroup<Record<string, StepConfigForm>>;

export type StepConfigForm = FormGroup<Record<string, ConfigValueForm>>;

export type ConfigValueForm = FormControl<UserConfigValueDto | undefined>;
