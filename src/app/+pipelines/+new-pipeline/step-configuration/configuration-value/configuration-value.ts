import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-configuration-value',
  imports: [],
  templateUrl: './configuration-value.html',
  styleUrl: './configuration-value.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationValue {}
