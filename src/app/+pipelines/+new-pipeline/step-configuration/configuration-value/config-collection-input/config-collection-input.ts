import { ChangeDetectionStrategy, Component, effect, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigCollection, configCollectionCodec, ConfigIdCollection } from './config-collection-input.interface';
import { disabled, form, FormField } from '@angular/forms/signals';
import { LazyConfiguration } from '@shared/lazy-input/lazy-configuration/lazy-configuration';

@Component({
  selector: 'app-config-collection-input',
  imports: [LazyConfiguration, FormField],
  templateUrl: './config-collection-input.html',
  styleUrl: './config-collection-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfigCollectionInput),
      multi: true,
    },
  ],
})
export class ConfigCollectionInput implements ControlValueAccessor {
  configModel = signal<ConfigCollection>({ configuration: null, version: null });
  configForm = form(this.configModel, (form) => {
    disabled(form.version, () => !form.configuration);
  });

  private onChange?: (v: ConfigCollection) => void;
  private onTouched?: () => void;

  constructor() {
    effect(() => {
      const value = this.configForm().value();
      this.onChange?.(value);
    });
    effect(() => {
      this.configForm.configuration().value();
      this.configForm.version().value.set(null);
    });
    effect(() => {
      if (this.configForm().touched()) {
        this.onTouched?.();
      }
    });
  }

  writeValue(obj: unknown): void {
    this.configModel.set(configCollectionCodec.parse(obj));
  }
  registerOnChange(fn: (v: ConfigCollection) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(_isDisabled: boolean): void {
    // TODO: add disabled
  }
}
