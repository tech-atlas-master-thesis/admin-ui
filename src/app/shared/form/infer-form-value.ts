import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

export type InferFormValue<TFormControl extends AbstractControl> =
  TFormControl extends FormControl<infer FormControlValue>
    ? FormControlValue
    : TFormControl extends FormGroup<infer FormGroupControls>
      ? {
          [ControlKey in keyof FormGroupControls]?: InferFormValue<FormGroupControls[ControlKey]>;
        }
      : TFormControl extends FormArray<infer FormArrayControls>
        ? InferFormValue<FormArrayControls>[]
        : never;
