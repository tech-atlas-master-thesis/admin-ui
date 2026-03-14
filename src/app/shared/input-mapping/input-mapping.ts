import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { TranslocoPipe } from '@jsverse/transloco';
import { AutoFocus } from 'primeng/autofocus';
import { form, FormField, required } from '@angular/forms/signals';
import { UserConfigEnumDto } from '@api/models/pipeline/user-config/user-config-enum-dto';
import { Select } from 'primeng/select';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { Tooltip } from 'primeng/tooltip';

type Mapping = Record<string, string>;

interface AddMappingForm {
  key: string;
  value: string;
}

@Component({
  selector: 'app-input-mapping',
  imports: [
    FormsModule,
    AutoComplete,
    Button,
    Popover,
    InputGroup,
    InputText,
    TranslocoPipe,
    AutoFocus,
    FormField,
    Select,
    LocalisedPipe,
    Tooltip,
  ],
  templateUrl: './input-mapping.html',
  styleUrl: './input-mapping.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMapping),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputMapping implements ControlValueAccessor {
  mappingAddKey = viewChild<ElementRef<HTMLInputElement>>('mappingAddKey');

  enumValues = input<UserConfigEnumDto[]>();
  readonly = input<boolean>();

  value = signal<Mapping>({});
  mappingStrings = computed(() => Object.entries(this.value()).map(([key, value]) => `${key} -> ${value}`));
  disabled = signal(false);

  addMappingValue = signal<AddMappingForm>({ key: '', value: '' });
  addMappingForm = form(this.addMappingValue, (path) => {
    required(path.key);
    required(path.value);
    // TODO: add validation for duplicate keys
  });

  private onChange?: (v: Mapping) => void;
  private onTouched?: () => void;

  constructor() {
    effect(() => {
      if (this.addMappingForm().touched()) {
        this.onTouched?.();
      }
    });
  }

  writeValue(v: Mapping): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: Mapping) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInputTouched() {
    this.onTouched?.();
  }

  protected onMappingAdded() {
    if (this.addMappingForm().invalid()) {
      this.addMappingForm().markAsDirty();
      return;
    }
    const { key, value } = this.addMappingForm().value();
    this.value.update((mapping) => ({ ...mapping, [key]: value }));
    this.onChange?.(this.value());
    this.addMappingValue.set({ key: '', value: '' });
    this.mappingAddKey()?.nativeElement?.focus();
  }
}
