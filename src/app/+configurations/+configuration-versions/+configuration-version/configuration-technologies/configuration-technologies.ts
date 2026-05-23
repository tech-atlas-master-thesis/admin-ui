import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigurationTechnologyField, ConfigurationTechnologyFieldCodex } from './configuration-technologies.codec';
import { applyEach, disabled, form, FormField, readonly, required } from '@angular/forms/signals';
import { PrimeTemplate, TreeNode } from 'primeng/api';
import { Tree, TreeNodeExpandEvent } from 'primeng/tree';
import { EqualityCheckUtil } from '@shared/util/equal';
import { TranslocoPipe } from '@jsverse/transloco';
import { InputText } from 'primeng/inputtext';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';

interface ConfigurationTechnologySelection {
  fieldIndex: number;
  techIndex?: number;
  color?: string;
  accent?: string;
}

interface ConfigurationTechnologyForm {
  technologyFields: ConfigurationTechnologyField[];
  edit: boolean;
  disabled: boolean;
}

@Component({
  selector: 'app-configuration-technologies',
  imports: [Tree, TranslocoPipe, InputText, FormField, AutoComplete, Button, PrimeTemplate],
  templateUrl: './configuration-technologies.html',
  styleUrl: './configuration-technologies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConfigurationTechnologies),
      multi: true,
    },
  ],
})
export class ConfigurationTechnologies implements ControlValueAccessor {
  private expandedNodes = new Map<number, boolean>();

  edit = input(false);

  currentSelection = signal<TreeNode<ConfigurationTechnologySelection> | undefined>(undefined);

  configuration = signal<ConfigurationTechnologyForm>(
    { technologyFields: [], edit: false, disabled: false },
    { equal: EqualityCheckUtil.deepEqual },
  );
  configForm = form(this.configuration, (path) => {
    readonly(path, (value) => !value.value().edit);
    disabled(path, (value) => value.value().disabled);
    applyEach(path.technologyFields, (fieldPath) => {
      required(fieldPath.label);
      required(fieldPath.style);
      required(fieldPath.technologies);
      applyEach(fieldPath.technologies, (techPath) => {
        required(techPath.label);
        required(techPath.searchTerms);
      });
    });
  });

  treeNodes = computed<TreeNode<ConfigurationTechnologySelection>[]>(() =>
    this.configForm
      .technologyFields()
      .value()
      .map((field, fieldIndex) => ({
        label: field.label ?? '',
        data: { fieldIndex, color: field.style.color ?? undefined, accent: field.style.accent ?? undefined },
        expanded: this.expandedNodes.get(fieldIndex) ?? false,
        type: 'fieldNode',
        children: field.technologies.map((tech, techIndex) => ({
          label: tech.label ?? '',
          data: {
            fieldIndex,
            techIndex,
            color: tech.style.color ?? undefined,
            accent: tech.style.accent ?? undefined,
          },
          type: 'techNode',
        })),
      })),
  );

  selectedFieldForm = computed(() => {
    const selection = this.currentSelection();
    if (selection?.data?.fieldIndex === undefined || selection?.data?.techIndex !== undefined) {
      return null;
    }
    return this.configForm.technologyFields[selection.data.fieldIndex];
  });

  selectedTechForm = computed(() => {
    const selection = this.currentSelection();
    if (selection?.data?.fieldIndex === undefined || selection?.data?.techIndex === undefined) {
      return null;
    }
    return this.configForm.technologyFields[selection.data.fieldIndex].technologies[selection.data.techIndex];
  });

  constructor() {
    this.initWriteback();

    effect(() => {
      this.configForm.edit().setControlValue(this.edit());
    });

    effect(() => {
      console.log(
        this.configForm().readonly(),
        this.configForm.technologyFields().readonly(),
        this.configForm.technologyFields[0].label().readonly(),
      );
    });
  }

  private onChange?: (v: object) => void;
  private onTouched?: () => void;

  writeValue(input: unknown): void {
    const configuration = Array.isArray(input)
      ? input.map((field) => ConfigurationTechnologyFieldCodex.decode(field))
      : [];
    this.configuration.update((config) => ({ ...config, technologyFields: configuration }));
  }
  registerOnChange(fn: (v: object) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.configForm.disabled().setControlValue(isDisabled);
  }

  private initWriteback() {
    effect(() => {
      this.onChange?.(this.configForm().value().technologyFields);
    });

    effect(() => {
      if (this.configForm().touched()) {
        this.onTouched?.();
      }
    });
  }

  protected onNodeExpand(event: TreeNodeExpandEvent, expanded: boolean) {
    console.log(event);
    const index = (event.node as TreeNode<ConfigurationTechnologySelection>).data?.fieldIndex;
    if (index === undefined) {
      return;
    }
    this.expandedNodes.set(index, expanded);
    console.log(this.expandedNodes);
  }

  protected addNewField() {
    this.configuration.update((config) => ({
      ...config,
      technologyFields: [
        ...config.technologyFields,
        { label: null, short: null, style: { color: null, accent: null }, technologies: [] },
      ],
    }));
    this.currentSelection.set({ data: { fieldIndex: this.configuration().technologyFields.length - 1 } });
  }

  protected addNewTechnology(fieldIndex: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (fieldIndex === undefined) {
      return;
    }
    this.configuration.update((config) => ({
      ...config,
      technologyFields: config.technologyFields.map((field, fi) =>
        fi === fieldIndex
          ? {
              ...field,
              technologies: [
                ...field.technologies,
                { label: null, short: null, style: { color: null, accent: null }, searchTerms: [] },
              ],
            }
          : field,
      ),
    }));
    const newLength = this.configuration().technologyFields.at(fieldIndex)?.technologies.length;
    if (newLength !== undefined) {
      this.currentSelection.set({ data: { fieldIndex, techIndex: newLength - 1 } });
    }
  }

  protected deleteField(fieldIndex: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (fieldIndex === undefined) {
      return;
    }
    this.configuration.update((config) => ({
      ...config,
      technologyFields: config.technologyFields.filter((_, i) => i !== fieldIndex),
    }));
    this.expandedNodes = new Map(
      [...this.expandedNodes.entries()]
        .filter(([index]) => index !== fieldIndex)
        .map(([index, expanded]) => [index > fieldIndex ? index - 1 : index, expanded]),
    );
  }

  protected deleteTech(fieldIndex: number | undefined, techIndex: number | undefined, event: MouseEvent) {
    event.stopPropagation();
    if (fieldIndex === undefined || techIndex === undefined) {
      return;
    }
    this.configuration.update((config) => ({
      ...config,
      technologyFields: [
        ...config.technologyFields.map((field, fi) =>
          fi === fieldIndex ? { ...field, technologies: field.technologies.filter((_, i) => i !== techIndex) } : field,
        ),
      ],
    }));
  }
}
