import { createMetadataKey } from '@angular/forms/signals';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';

export const STEP_DEFINITION = createMetadataKey<StepConfigDto>();
export const CONFIG_DEFINITION = createMetadataKey<UserConfigDefinitionDto>();
