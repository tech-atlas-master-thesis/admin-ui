import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
import {
  ConfigurationTechnology,
  ConfigurationTechnologyField,
  ConfigurationTechnologyFieldCodex,
} from './configuration-technologies.codec';
import { applyEach, form, FormField, FormValueControl, readonly, required } from '@angular/forms/signals';
import { PrimeTemplate, TreeDragDropService, TreeNode } from 'primeng/api';
import { Tree, TreeNodeDropEvent, TreeNodeExpandEvent } from 'primeng/tree';
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
  invalid?: boolean;
  childInvalid?: boolean;
}

interface ConfigurationTechnologyForm {
  technologyFields: ConfigurationTechnologyField[];
  readonly: boolean;
}

@Component({
  selector: 'app-configuration-technologies',
  imports: [Tree, TranslocoPipe, InputText, FormField, AutoComplete, Button, PrimeTemplate],
  templateUrl: './configuration-technologies.html',
  styleUrl: './configuration-technologies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeDragDropService],
})
export class ConfigurationTechnologies implements FormValueControl<object> {
  private expandedNodes = new Map<number, boolean>();

  value = model<object>({});
  readonly = input(false);
  valid = model<boolean>(true);

  currentSelection = signal<TreeNode<ConfigurationTechnologySelection> | undefined>(undefined);

  configuration = linkedSignal<ConfigurationTechnologyForm>(
    () => {
      const input = this.value();
      const configuration = Array.isArray(input)
        ? input.map((field) => ConfigurationTechnologyFieldCodex.decode(field))
        : [];
      return { technologyFields: configuration, readonly: this.readonly() };
    },
    { equal: EqualityCheckUtil.deepEqual },
  );
  configForm = form(this.configuration, (path) => {
    readonly(path, (value) => value.value().readonly);
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

  edit = computed(() => !this.configForm().readonly());

  treeNodes = computed<TreeNode<ConfigurationTechnologySelection>[]>(() =>
    this.configForm
      .technologyFields()
      .value()
      .map((field, fieldIndex) => ({
        label: field.label ?? '',
        data: {
          fieldIndex,
          color: field.style.color ?? undefined,
          accent: field.style.accent ?? undefined,
          invalid: !field.label,
          childInvalid: field.technologies.some((tech) => !tech.label),
        },
        expanded: this.expandedNodes.get(fieldIndex) ?? false,
        type: 'fieldNode',
        children: field.technologies.map((tech, techIndex) => ({
          label: tech.label ?? '',
          data: {
            fieldIndex,
            techIndex,
            color: tech.style.color ?? undefined,
            accent: tech.style.accent ?? undefined,
            invalid: !tech.label,
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
  }

  private initWriteback() {
    effect(() => {
      this.value.set(this.configForm.technologyFields().value());
    });

    effect(() => {
      this.valid.set(this.configForm().valid());
    });
  }

  protected onNodeExpand(event: TreeNodeExpandEvent, expanded: boolean) {
    const index = (event.node as TreeNode<ConfigurationTechnologySelection>).data?.fieldIndex;
    if (index === undefined) {
      return;
    }
    this.expandedNodes.set(index, expanded);
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

  protected onNodeDrop(event: TreeNodeDropEvent) {
    console.log(event);
    console.log(event.dropNode?.parent, event.dragNode?.parent);
    if (event.dropNode?.parent === undefined && event.dragNode?.parent === undefined) {
      this.configuration.update((config) => {
        const field = config.technologyFields[event.dragNode?.data.fieldIndex];
        const beforeInsert = config.technologyFields.slice(0, event.index).filter((f) => !this.nodesEqual(field, f));
        const afterInsert = config.technologyFields.slice(event.index).filter((f) => !this.nodesEqual(field, f));
        console.log(config.technologyFields, [...beforeInsert, field, ...afterInsert]);
        return { ...config, technologyFields: [...beforeInsert, field, ...afterInsert] };
      });
    }
    if (event.dragNode?.parent !== undefined) {
      const fieldIndex = event.dropNode?.data.fieldIndex;
      if (!fieldIndex) {
        return;
      }
      this.configuration.update((config) => {
        const field = config.technologyFields[fieldIndex];
        const tech = field.technologies[event.dragNode?.data.techIndex];
        const beforeInsert = field.technologies.slice(0, event.index).filter((t) => !this.nodesEqual(t, tech));
        const afterInsert = field.technologies.slice(event.index).filter((t) => !this.nodesEqual(t, tech));
        return {
          ...config,
          technologyFields: config.technologyFields.map((f) => {
            if (!this.nodesEqual(f, field)) {
              return f;
            }
            return {
              ...f,
              technologies: [...beforeInsert, tech, ...afterInsert],
            };
          }),
        };
      });
    }
  }

  private nodesEqual(
    a: ConfigurationTechnologyField | ConfigurationTechnology,
    b: ConfigurationTechnologyField | ConfigurationTechnology,
  ) {
    return a.label === b.label && a.short === b.short;
  }
}
