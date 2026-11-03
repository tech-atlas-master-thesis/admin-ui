import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ConfigValueForm } from '../../new-pipeline.interface';
import { UserConfigDefinitionDto } from '@api/models/pipeline/user-config/user-config-definition-dto';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { UserConfigTypeDto } from '@api/models/pipeline/user-config/user-config-type-dto';
import { InputText } from '@openng/optimus-ui/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumber } from '@openng/optimus-ui/inputnumber';
import { Textarea } from '@openng/optimus-ui/textarea';
import { Select } from '@openng/optimus-ui/select';
import { AutoComplete } from '@openng/optimus-ui/autocomplete';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { InputMapping } from '@shared/input-mapping/input-mapping';
import { ConfigCollectionInput } from './config-collection-input/config-collection-input';
import { DatePicker } from '@openng/optimus-ui/datepicker';
import { Checkbox } from '@openng/optimus-ui/checkbox';

@Component({
  selector: 'app-configuration-value',
  imports: [
    LocalisedPipe,
    InputText,
    ReactiveFormsModule,
    InputNumber,
    Textarea,
    Select,
    AutoComplete,
    Tooltip,
    InputMapping,
    ConfigCollectionInput,
    DatePicker,
    Checkbox,
  ],
  templateUrl: './configuration-value.html',
  styleUrl: './configuration-value.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationValue {
  protected readonly UserConfigTypeDto = UserConfigTypeDto;

  configForm = input.required<ConfigValueForm>();
  configDefinition = input.required<UserConfigDefinitionDto>();
  edit = input<boolean>();
}
