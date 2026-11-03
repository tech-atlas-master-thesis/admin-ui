import { afterRenderEffect, ChangeDetectorRef, computed, Directive, inject, OnInit, signal } from '@angular/core';
import { FormField } from '@angular/forms/signals';

/**
 * Bridges gaps between Signal Forms (`[formField]`) and Optimus UI form controls until Optimus UI supports
 * Signal Forms natively (openng-org/optimus-ui#1971):
 *
 * - Signal Forms writes the field state (`readonly`, `required`, ...) straight into the inputs of the host component.
 *   Optimus UI still declares most of these as decorator `@Input`s, and such a write does not mark the OnPush host
 *   component for check, so e.g. toggling `readonly` when entering edit mode would not be rendered.
 *   This directive marks the host component for check whenever that field state changes.
 * - Optimus UI renders `invalid` even for pristine fields (openng-org/optimus-ui#162). This directive adds the
 *   `app-untouched` class to untouched fields, which `styles.scss` uses to hide the invalid styling until the user
 *   has interacted with the field.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector -- must attach to the Optimus UI form controls
  selector: `
    input[pInputText][formField], textarea[pTextarea][formField],
    p-select[formField],
    p-autocomplete[formField], p-autoComplete[formField], p-auto-complete[formField],
    p-multiselect[formField], p-multiSelect[formField], p-multi-select[formField],
    p-checkbox[formField], p-checkBox[formField], p-check-box[formField],
    p-inputnumber[formField], p-inputNumber[formField], p-input-number[formField],
    p-listbox[formField], p-listBox[formField], p-list-box[formField],
    p-datepicker[formField], p-datePicker[formField], p-date-picker[formField]
  `,
  host: {
    '[class.app-untouched]': 'untouched()',
  },
})
export class OptimusFormFieldSync implements OnInit {
  private readonly formField = inject(FormField);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  // The required `formField` input must not be read before it is bound, which is guaranteed from ngOnInit on.
  private readonly initialized = signal(false);

  protected readonly untouched = computed(() => !this.formField.state().touched());

  constructor() {
    afterRenderEffect(() => {
      if (!this.initialized()) {
        return;
      }
      const state = this.formField.state();
      state.readonly();
      state.disabled();
      state.required();
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.initialized.set(true);
  }
}
