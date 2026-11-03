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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from '@openng/optimus-ui/button';
import { Popover } from '@openng/optimus-ui/popover';
import { InputGroup } from '@openng/optimus-ui/inputgroup';
import { InputText } from '@openng/optimus-ui/inputtext';
import { TranslocoPipe } from '@jsverse/transloco';
import { AutoFocus } from '@openng/optimus-ui/autofocus';
import { form, FormField, required } from '@angular/forms/signals';
import { UserConfigEnumDto } from '@api/models/pipeline/user-config/user-config-enum-dto';
import { Select } from '@openng/optimus-ui/select';
import { LocalisedPipe } from '@shared/i18n/localised.pipe';
import { Tooltip } from '@openng/optimus-ui/tooltip';
import { Tag } from '@openng/optimus-ui/tag';
import { OptimusFormFieldSync } from '@shared/forms/optimus-form-field-sync';

type Mapping = Record<string, string>;

interface AddMappingForm {
  key: string;
  value: string;
}

@Component({
  selector: 'app-input-mapping',
  imports: [
    Button,
    Popover,
    InputGroup,
    InputText,
    TranslocoPipe,
    AutoFocus,
    FormField,
    OptimusFormFieldSync,
    Select,
    LocalisedPipe,
    Tooltip,
    Tag,
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

  value = signal<Mapping | null>({});
  mappings = computed(() => Object.entries(this.value() ?? {}).map(([key, value]) => ({ key, value })));
  disabled = signal(false);

  addMappingValue = signal<AddMappingForm>({ key: '', value: '' });
  addMappingForm = form(this.addMappingValue, (path) => {
    required(path.key);
    required(path.value);
    // TODO: add validation for duplicate keys
  });

  private onChange?: (v: Mapping | null) => void;
  private onTouched?: () => void;

  constructor() {
    effect(() => {
      if (this.addMappingForm().touched()) {
        this.onTouched?.();
      }
    });
    effect(() => {
      this.onChange?.(this.value());
    });
  }

  writeValue(v: Mapping | null): void {
    this.value.set(v);
  }
  registerOnChange(fn: (v: Mapping | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onMappingAdded() {
    if (this.addMappingForm().invalid()) {
      this.addMappingForm().markAsDirty();
      return;
    }
    const { key, value } = this.addMappingForm().value();
    this.value.update((mapping) => ({ ...mapping, [key]: value }));
    this.addMappingValue.set({ key: '', value: '' });
    this.mappingAddKey()?.nativeElement?.focus();
  }

  protected removeMapping(mappingKey: string) {
    this.value.update((mapping) =>
      Object.fromEntries(Object.entries(mapping ?? {}).filter(([key]) => key !== mappingKey)),
    );
  }
}
