import { computed, inject, Injectable, resource, Signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { PipelineApi } from '@api/service/pipeline-api';
import { SelectItem } from 'primeng/api';
import { PipelineConfigDto } from '@api/models/pipeline/pipeline-config-dto';
import { I18nService } from '@shared/i18n/i18n-service';
import { PipelinesStore } from './pipelines.store';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';
import { PipelineConfigForm } from './+new-pipeline/new-pipeline.interface';
import { UserConfigValueDto } from '@api/models/pipeline/user-config/user-config-value-dto';
import { UserConfigTypeDto } from '@api/models/pipeline/user-config/user-config-type-dto';
import { configurationValidator } from './+new-pipeline/validators/configurationValidator';
import { StepConfigDto } from '@api/models/pipeline/step-config-dto';

@Injectable()
export class PipelineService {
  private readonly pipelinesStore = inject(PipelinesStore);
  private readonly pipelineApi = inject(PipelineApi);
  private readonly i18nService = inject(I18nService);
  private readonly fb = inject(NonNullableFormBuilder);

  typeOptions = computed<SelectItem<PipelineConfigDto>[]>(() => {
    this.i18nService.currentLanguage();
    return (
      this.pipelinesStore.pipelineTypes()?.map((type) => ({
        label: this.i18nService.localised(type.displayName, type.type),
        value: type,
      })) ?? []
    );
  });

  getPipelineConfigDefinition(pipelineType: Signal<string | undefined>) {
    return resource({
      params: pipelineType,
      loader: (pipelineType) =>
        firstValueFrom(
          pipelineType.params
            ? this.pipelineApi.getPipelineTypeConfigDefinition(pipelineType.params ?? '')
            : of(undefined),
        ),
    });
  }

  getPipelineForm(
    userConfig: Record<string, Record<string, UserConfigDefinitionDto>>,
    values?: Record<string, Record<string, UserConfigValueDto>>,
  ): PipelineConfigForm {
    return this.fb.group(
      Object.fromEntries(
        Object.entries(userConfig).map(([stepName, stepConfig]) => [
          stepName,
          this.fb.group(
            Object.fromEntries(
              Object.entries(stepConfig).map(([configName, config]) => {
                return [configName, this.getConfigValueForm(config, values?.[stepName]?.[configName])];
              }),
            ),
          ),
        ]),
      ),
    );
  }

  resetPipelineForm(form: PipelineConfigForm, values?: Record<string, Record<string, UserConfigValueDto>>) {
    Object.entries(form.controls).forEach(([stepName, stepForm]) =>
      Object.entries(stepForm.controls).forEach(([configName, configForm]) => {
        configForm.setValue(values?.[stepName]?.[configName] ?? undefined);
      }),
    );
  }

  serializePipelineConfig(pipelineConfigForm: PipelineConfigForm) {
    return Object.fromEntries(
      Object.entries(pipelineConfigForm.value)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [
          key,
          Object.fromEntries(Object.entries(value ?? {}).filter(([, value]) => value !== undefined)),
        ]),
    );
  }

  getUserConfigDefinition(userConfig: StepConfigDto[] | undefined) {
    return Object.fromEntries(
      userConfig?.map((stepConfig) => [
        stepConfig.name,
        Object.fromEntries(stepConfig.userConfig?.map((config) => [config.name, config]) ?? []),
      ]) ?? [],
    );
  }

  private getConfigValueForm(config: UserConfigDefinitionDto, value?: UserConfigValueDto) {
    const formControl = this.fb.control<UserConfigValueDto | undefined>(
      value ?? config.defaultValue,
      config.required ? Validators.required : undefined,
    );
    if (config.type === UserConfigTypeDto.CONFIGURATION) {
      formControl.addValidators(configurationValidator);
    }
    return formControl;
  }
}
