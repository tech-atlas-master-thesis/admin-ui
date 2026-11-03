import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  signal,
  untracked,
} from '@angular/core';
import { applyEach, form, FormField, FormValueControl, readonly, required } from '@angular/forms/signals';
import { EqualityCheckUtil } from '@shared/util/equal';
import { ConfigurationRegexMapCodec } from './configuration-regex-map.codec';
import { InputText } from '@openng/optimus-ui/inputtext';
import { TranslocoPipe } from '@jsverse/transloco';
import { AutoComplete } from '@openng/optimus-ui/autocomplete';
import { Listbox } from '@openng/optimus-ui/listbox';
import { FormsModule } from '@angular/forms';
import { OptimusFormFieldSync } from '@shared/forms/optimus-form-field-sync';

@Component({
  selector: 'app-configuration-regex-map',
  imports: [InputText, FormField, OptimusFormFieldSync, TranslocoPipe, AutoComplete, Listbox, FormsModule],
  templateUrl: './configuration-regex-map.component.html',
  styleUrl: './configuration-regex-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationRegexMapComponent implements FormValueControl<object> {
  value = model<object>({});
  readonly = input(false);
  valid = model<boolean>(true);

  configuration = linkedSignal(
    () => {
      const input = this.value();
      console.log(input);
      if (!Array.isArray(input)) {
        return {};
      }
      return Object.fromEntries(ConfigurationRegexMapCodec.decode(input).map((element) => [element.name, element]));
    },
    { equal: EqualityCheckUtil.deepEqual },
  );
  configForm = form(this.configuration, (path) => {
    readonly(path, () => this.readonly());
    applyEach(path, (element) => {
      required(element.name);
      required(element.mapTo);
      required(element.keywords);
    });
  });

  elementNames = computed(() => Object.values(this.configForm().value()).map((element) => element.name));

  selectedName = signal<string | undefined>(undefined);
  selectedForm = computed(() => {
    const name = this.selectedName();
    return untracked(() => {
      if (!name) {
        return;
      }
      return this.configForm[name];
    });
  });

  constructor() {
    this.initWriteback();
  }

  private initWriteback() {
    effect(() => {
      console.log(Object.values(this.configForm().value()));
      this.value.set(Object.values(this.configForm().value()));
    });

    effect(() => {
      this.valid.set(this.configForm().valid());
    });
  }
}
