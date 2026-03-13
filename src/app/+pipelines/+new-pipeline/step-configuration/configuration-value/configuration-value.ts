import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConfigValueForm } from '../../new-pipeline.interface';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { UserConfigTypeDto } from '@api/models/pipeline/user-config/user-config-type-dto';
import { InputText } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { AutoComplete } from 'primeng/autocomplete';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-configuration-value',
  imports: [LocalisedPipe, InputText, ReactiveFormsModule, InputNumber, Textarea, Select, AutoComplete, Tooltip],
  templateUrl: './configuration-value.html',
  styleUrl: './configuration-value.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationValue {
  configForm = input.required<ConfigValueForm>();
  configDefinition = input.required<UserConfigDefinitionDto>();
  protected readonly UserConfigTypeDto = UserConfigTypeDto;
}
