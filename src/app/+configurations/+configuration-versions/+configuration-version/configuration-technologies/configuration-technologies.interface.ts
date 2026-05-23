import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type ConfigurationTechnologyFieldFormGroup = FormGroup<{
  label: FormControl<string | undefined>;
  short: FormControl<string | undefined>;
  style: ConfigurationTechnologyStyleFormGroup;
  technologies: FormArray<ConfigurationTechnologyFormGroup>;
}>;

export type ConfigurationTechnologyFormGroup = FormGroup<{
  label: FormControl<string | undefined>;
  short: FormControl<string | undefined>;
  searchTerms: FormControl<string[]>;
}>;

export type ConfigurationTechnologyStyleFormGroup = FormGroup<{
  color: FormControl<string | undefined>;
  accent: FormControl<string | undefined>;
}>;
