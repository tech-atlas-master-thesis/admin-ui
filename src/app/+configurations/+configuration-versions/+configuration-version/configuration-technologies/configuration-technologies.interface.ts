import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type ConfigurationTechnologyFieldFormGroup = FormGroup<{
  label: FormControl<string | undefined>;
  short: FormControl<string | undefined>;
  style: ConfigurationTechnologyStyleFormGroup;
  programmes: FormControl<string[]>;
  technologies: FormArray<ConfigurationTechnologyFormGroup>;
}>;

export type ConfigurationTechnologyFormGroup = FormGroup<{
  label: FormControl<string | undefined>;
  short: FormControl<string | undefined>;
  programmes: FormControl<string[]>;
  searchTerms: FormControl<string[]>;
}>;

export type ConfigurationTechnologyStyleFormGroup = FormGroup<{
  color: FormControl<string | undefined>;
  accent: FormControl<string | undefined>;
}>;
